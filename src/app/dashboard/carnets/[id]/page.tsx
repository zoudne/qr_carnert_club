import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQRDataUrl, getPublicUrl } from "@/lib/qr";
import Navbar from "@/components/Navbar";
import CarnetDetailClient from "./CarnetDetailClient";

type PageProps = { params: Promise<{ id: string }> };

export default async function CarnetDetailPage({ params }: PageProps) {
  const session = await getSession();
  const { id } = await params;

  const carnet = await prisma.carnet.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!carnet) {
    notFound();
  }

  const publicUrl = getPublicUrl(carnet.qrToken);
  const qrDataUrl = await generateQRDataUrl(publicUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-brand-light/20">
      <Navbar username={session?.username} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <CarnetDetailClient
          carnet={{
            id: carnet.id,
            carnetNumber: carnet.carnetNumber,
            expiryDate: carnet.expiryDate.toISOString().split("T")[0],
            ownerName: carnet.ownerName,
            plateNumber: carnet.plateNumber,
            vin: carnet.vin,
            carType: carnet.carType,
          }}
          qrDataUrl={qrDataUrl}
        />
      </main>
    </div>
  );
}
