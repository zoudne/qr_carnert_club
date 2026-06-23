import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQRDataUrl, getPublicUrl } from "@/lib/qr";

export async function GET(request: Request) {
  try {
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(carnets);
  } catch {
    return NextResponse.json(
      { errorKey: "errors.fetchCarnets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
        expiryDate: new Date(expiryDate),
        ownerName,
        plateNumber,
        vin,
        carType,
      },
    });

    const publicUrl = getPublicUrl(carnet.qrToken);
    const qrDataUrl = await generateQRDataUrl(publicUrl);

    return NextResponse.json({ carnet, qrDataUrl, publicUrl }, { status: 201 });
  } catch {
    return NextResponse.json(
      { errorKey: "errors.createCarnet" },
      { status: 500 }
    );
  }
}
