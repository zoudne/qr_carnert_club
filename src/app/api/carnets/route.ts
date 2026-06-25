import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { carnetInclude, serializeCarnet } from "@/lib/carnet-serialize";
import { isValidExpiryDate, parseExpiryDate } from "@/lib/carnet";
import { prisma } from "@/lib/prisma";
import { generateQRDataUrl, getPublicUrl } from "@/lib/qr";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";

    const carnets = await prisma.carnet.findMany({
      where: search
        ? {
            OR: [
              { carnetNumber: { contains: search } },
              { ownerName: { contains: search } },
              { plateNumber: { contains: search } },
              { vin: { contains: search } },
            ],
          }
        : undefined,
      include: carnetInclude,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(carnets.map(serializeCarnet));
  } catch {
    return NextResponse.json(
      { errorKey: "errors.fetchCarnets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ errorKey: "errors.unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { carnetNumber, expiryDate, ownerName, plateNumber, vin, carType } =
      body;

    if (
      !carnetNumber ||
      !expiryDate ||
      !ownerName ||
      !plateNumber ||
      !vin ||
      !carType
    ) {
      return NextResponse.json(
        { errorKey: "errors.requiredFields" },
        { status: 400 }
      );
    }

    if (!isValidExpiryDate(expiryDate)) {
      return NextResponse.json(
        { errorKey: "errors.invalidExpiryDate" },
        { status: 400 }
      );
    }

    const parsedExpiryDate = parseExpiryDate(expiryDate)!;

    const existing = await prisma.carnet.findUnique({
      where: { carnetNumber },
    });
    if (existing) {
      return NextResponse.json(
        { errorKey: "errors.duplicateCarnet" },
        { status: 409 }
      );
    }

    const carnet = await prisma.carnet.create({
      data: {
        carnetNumber,
        expiryDate: parsedExpiryDate,
        ownerName,
        plateNumber,
        vin,
        carType,
        createdById: session.userId,
      },
      include: carnetInclude,
    });

    const publicUrl = getPublicUrl(carnet.qrToken);
    const qrDataUrl = await generateQRDataUrl(publicUrl);

    return NextResponse.json(
      { carnet: serializeCarnet(carnet), qrDataUrl, publicUrl },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { errorKey: "errors.createCarnet" },
      { status: 500 }
    );
  }
}
