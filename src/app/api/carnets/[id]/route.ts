import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { carnetInclude, serializeCarnet } from "@/lib/carnet-serialize";
import { isValidExpiryDate, parseExpiryDate } from "@/lib/carnet";
import { canDeleteCarnet, canEditCarnet } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { generateQRDataUrl, getPublicUrl } from "@/lib/qr";
import type { UserRole } from "@/lib/permissions";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const carnet = await prisma.carnet.findUnique({
      where: { id: parseInt(id, 10) },
      include: carnetInclude,
    });

    if (!carnet) {
      return NextResponse.json(
        { errorKey: "errors.notFound" },
        { status: 404 }
      );
    }

    const publicUrl = getPublicUrl(carnet.qrToken);
    const qrDataUrl = await generateQRDataUrl(publicUrl);
    const serialized = serializeCarnet(carnet);

    return NextResponse.json({
      carnet: serialized,
      qrDataUrl,
      publicUrl,
      canEdit: canEditCarnet(session.role as UserRole, carnet.createdAt),
      canDelete: canDeleteCarnet(session.role as UserRole),
    });
  } catch {
    return NextResponse.json(
      { errorKey: "errors.fetchCarnets" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { carnetNumber, expiryDate, ownerName, plateNumber, vin, carType } =
      body;

    const existing = await prisma.carnet.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!existing) {
      return NextResponse.json(
        { errorKey: "errors.notFound" },
        { status: 404 }
      );
    }

    if (!canEditCarnet(session.role as UserRole, existing.createdAt)) {
      return NextResponse.json(
        { errorKey: "errors.editWindowExpired" },
        { status: 403 }
      );
    }

    if (carnetNumber !== existing.carnetNumber) {
      const duplicate = await prisma.carnet.findUnique({
        where: { carnetNumber },
      });
      if (duplicate) {
        return NextResponse.json(
          { errorKey: "errors.duplicateCarnet" },
          { status: 409 }
        );
      }
    }

    if (!isValidExpiryDate(expiryDate)) {
      return NextResponse.json(
        { errorKey: "errors.invalidExpiryDate" },
        { status: 400 }
      );
    }

    const parsedExpiryDate = parseExpiryDate(expiryDate)!;

    const carnet = await prisma.carnet.update({
      where: { id: parseInt(id, 10) },
      data: {
        carnetNumber,
        expiryDate: parsedExpiryDate,
        ownerName,
        plateNumber,
        vin,
        carType,
      },
      include: carnetInclude,
    });

    const publicUrl = getPublicUrl(carnet.qrToken);
    const qrDataUrl = await generateQRDataUrl(publicUrl);

    return NextResponse.json({
      carnet: serializeCarnet(carnet),
      qrDataUrl,
      publicUrl,
      canEdit: canEditCarnet(session.role as UserRole, carnet.createdAt),
      canDelete: canDeleteCarnet(session.role as UserRole),
    });
  } catch {
    return NextResponse.json(
      { errorKey: "errors.updateCarnet" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }

    if (!canDeleteCarnet(session.role as UserRole)) {
      return NextResponse.json({ errorKey: "errors.forbidden" }, { status: 403 });
    }

    const { id } = await context.params;

    await prisma.carnet.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { errorKey: "errors.deleteCarnet" },
      { status: 500 }
    );
  }
}
