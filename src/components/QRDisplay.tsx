"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useTranslation } from "./LocaleProvider";

interface QRDisplayProps {
  qrDataUrl: string;
  carnetNumber: string;
  showActions?: boolean;
}

export default function QRDisplay({
  qrDataUrl,
  carnetNumber,
  showActions = true,
}: QRDisplayProps) {
  const { t } = useTranslation();

  function handleDownload() {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qr-${carnetNumber}.png`;
    link.click();
  }

  return (
    <div className="card flex flex-col items-center gap-4 p-6">
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-2xl border-2 border-dashed border-brand-ring bg-brand-light/40 p-4">
          <Image
            src={qrDataUrl}
            alt={t("qr.alt", { number: carnetNumber })}
            width={200}
            height={200}
            className="rounded-lg"
            unoptimized
          />
        </div>
        <p className="text-center text-lg font-bold tracking-wide text-zinc-900">
          {carnetNumber}
        </p>
      </div>
      {showActions && (
        <button onClick={handleDownload} className="btn-primary">
          <Download className="h-4 w-4" />
          {t("qr.download")}
        </button>
      )}
    </div>
  );
}
