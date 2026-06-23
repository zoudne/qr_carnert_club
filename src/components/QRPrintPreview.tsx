"use client";

import Image from "next/image";
import { Printer } from "lucide-react";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  QR_LEFT_PX,
  QR_RIGHT_PX,
  QR_SIZE_PX,
  QR_TOP_PX,
} from "@/lib/qr";
import { useTranslation } from "./LocaleProvider";

interface QRPrintPreviewProps {
  qrDataUrl: string;
  carnetNumber: string;
}

export default function QRPrintPreview({
  qrDataUrl,
  carnetNumber,
}: QRPrintPreviewProps) {
  const { t } = useTranslation();

  function handlePrint() {
    window.print();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
        <button onClick={handlePrint} className="btn-primary">
          <Printer className="h-4 w-4" />
          {t("print.button")}
        </button>
        <p className="flex items-center text-sm text-zinc-500">
          {t("print.previewHint")}
        </p>
      </div>

      <div className="print-area flex justify-center print:block">
        <div
          className="relative border border-zinc-300 bg-white shadow-lg print:border-0 print:shadow-none"
          style={{
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
          }}
        >
          <div
            className="absolute flex flex-col items-center"
            style={{
              top: QR_TOP_PX,
              left: QR_LEFT_PX,
              width: QR_SIZE_PX,
            }}
          >
            <Image
              src={qrDataUrl}
              alt={t("qr.alt", { number: carnetNumber })}
              width={QR_SIZE_PX}
              height={QR_SIZE_PX}
              className="print-qr"
              unoptimized
            />
            <p className="print-carnet-number mt-1 min-w-[105px] whitespace-nowrap text-center text-[9px] font-bold leading-tight text-black">
              {carnetNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="card mt-4 p-4 text-sm text-zinc-600 print:hidden">
        <p className="font-semibold text-zinc-800">{t("print.specsTitle")}</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            {t("print.paperSize", {
              width: A4_WIDTH_PX,
              height: A4_HEIGHT_PX,
            })}
          </li>
          <li>{t("print.qrSize", { size: QR_SIZE_PX })}</li>
          <li>{t("print.fromTop", { value: QR_TOP_PX })}</li>
          <li>{t("print.fromLeft", { value: QR_LEFT_PX })}</li>
          <li>{t("print.fromRight", { value: QR_RIGHT_PX })}</li>
        </ul>
      </div>
    </div>
  );
}
