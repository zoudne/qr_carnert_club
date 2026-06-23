const carnetInclude = {
  createdBy: { select: { username: true } },
} as const;

export function serializeCarnet(
  carnet: {
    id: number;
    carnetNumber: string;
    expiryDate: Date;
    ownerName: string;
    plateNumber: string;
    vin: string;
    carType: string;
    qrToken: string;
    createdAt: Date;
    updatedAt: Date;
    createdById: number | null;
    createdBy: { username: string } | null;
  }
) {
  return {
    id: carnet.id,
    carnetNumber: carnet.carnetNumber,
    expiryDate: carnet.expiryDate,
    ownerName: carnet.ownerName,
    plateNumber: carnet.plateNumber,
    vin: carnet.vin,
    carType: carnet.carType,
    qrToken: carnet.qrToken,
    createdAt: carnet.createdAt,
    updatedAt: carnet.updatedAt,
    createdById: carnet.createdById,
    createdByUsername: carnet.createdBy?.username ?? null,
  };
}

export { carnetInclude };
