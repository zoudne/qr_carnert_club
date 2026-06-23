import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { carnetInclude, serializeCarnet } from "@/lib/carnet-serialize";
import { canEditCarnet } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { generateQRDataUrl, getPublicUrl } from "@/lib/qr";
import type { UserRole } from "@/lib/permissions";
import Navbar from "@/components/Navbar";
import CarnetDetailClient from "./CarnetDetailClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function CarnetDetailPage({ params }: PageProps) {
  const session = await getSession();
  const { id } = await params;

  const carnet = await prisma.carnet.findUnique({
    where: { id: parseInt(id, 10) },
    include: carnetInclude,
  });

  if (!carnet) {
    notFound();
  }

  const publicUrl = getPublicUrl(carnet.qrToken);
  const qrDataUrl = await generateQRDataUrl(publicUrl);
  const serialized = serializeCarnet(carnet);
  const role = (session?.role ?? "USER") as UserRole;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-brand-light/20">
      <Navbar
        username={session?.username}
        isAdmin={role === "ADMIN"}
      />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <CarnetDetailClient
          carnet={{
            id: serialized.id,
            carnetNumber: serialized.carnetNumber,
            expiryDate: serialized.expiryDate.toISOString().split("T")[0],
            ownerName: serialized.ownerName,
            plateNumber: serialized.plateNumber,
            vin: serialized.vin,
            carType: serialized.carType,
            createdAt: serialized.createdAt.toISOString(),
            createdByUsername: serialized.createdByUsername,
          }}
          qrDataUrl={qrDataUrl}
          canEdit={canEditCarnet(role, serialized.createdAt)}
          isAdmin={role === "ADMIN"}
        />
      </main>
    </div>
  );
}
