import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQRDataUrl, getPublicUrl } from "@/lib/qr";
import { createTranslator } from "@/i18n";
import { getLocale } from "@/lib/locale";
import Navbar from "@/components/Navbar";
import QRPrintPreview from "@/components/QRPrintPreview";

type PageProps = { params: Promise<{ id: string }> };

export default async function PrintCarnetPage({ params }: PageProps) {
  const session = await getSession();
  const locale = await getLocale();
  const t = createTranslator(locale);
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
      <Navbar username={session?.username} isAdmin={session?.role === "ADMIN"} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="page-header">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {t("carnet.printTitle")}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {t("carnet.carnetNumberLabel", { number: carnet.carnetNumber })}
            </p>
          </div>
          <Link
            href={`/dashboard/carnets/${carnet.id}`}
            className="btn-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("carnet.backToDetails")}
          </Link>
        </div>

        <QRPrintPreview
          qrDataUrl={qrDataUrl}
          carnetNumber={carnet.carnetNumber}
        />
      </main>
    </div>
  );
}
