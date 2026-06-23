import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCarnetStatus } from "@/lib/carnet";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;

    const carnet = await prisma.carnet.findUnique({
      where: { qrToken: token },
      select: {
        carnetNumber: true,
        expiryDate: true,
        ownerName: true,
        plateNumber: true,
        vin: true,
        carType: true,
      },
    });

    if (!carnet) {
      return NextResponse.json(
        { errorKey: "errors.notFound" },
        { status: 404 }
      );
    }

    const status = getCarnetStatus(carnet.expiryDate);

    return NextResponse.json({ carnet, status });
  } catch {
    return NextResponse.json(
      { errorKey: "errors.fetchCarnets" },
      { status: 500 }
    );
  }
}
