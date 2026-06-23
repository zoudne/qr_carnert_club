import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRDataUrl, getPublicUrl } from "@/lib/qr";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const carnet = await prisma.carnet.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!carnet) {
      return NextResponse.json(
        { errorKey: "errors.notFound" },
        { status: 404 }
      );
    }

    const publicUrl = getPublicUrl(carnet.qrToken);
    const qrDataUrl = await generateQRDataUrl(publicUrl);

    return NextResponse.json({ carnet, qrDataUrl, publicUrl });
  } catch {
    return NextResponse.json(
      { errorKey: "errors.fetchCarnets" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
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

    const carnet = await prisma.carnet.update({
      where: { id: parseInt(id, 10) },
      data: {
        carnetNumber,
        expiryDate: new Date(expiryDate),
        ownerName,
        plateNumber,
        vin,
        carType,
      },
    });

    const publicUrl = getPublicUrl(carnet.qrToken);
    const qrDataUrl = await generateQRDataUrl(publicUrl);

    return NextResponse.json({ carnet, qrDataUrl, publicUrl });
  } catch {
    return NextResponse.json(
      { errorKey: "errors.updateCarnet" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
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
