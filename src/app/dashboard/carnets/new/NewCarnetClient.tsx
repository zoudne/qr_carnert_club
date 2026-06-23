"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  PlusCircle,
  Printer,
} from "lucide-react";
import CarnetForm from "@/components/CarnetForm";
import { useTranslation } from "@/components/LocaleProvider";
import QRDisplay from "@/components/QRDisplay";
import { CarnetFormData } from "@/lib/carnet";
import { translateApiError } from "@/lib/translate-error";

interface CreatedCarnet {
  id: number;
  carnetNumber: string;
}

export default function NewCarnetClient() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{
    carnet: CreatedCarnet;
    qrDataUrl: string;
  } | null>(null);

  async function handleSubmit(data: CarnetFormData) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/carnets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(translateApiError(t, result));
        return;
      }

      setCreated({
        carnet: result.carnet,
        qrDataUrl: result.qrDataUrl,
      });
    } catch {
      setError(t("errors.connectionError"));
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          {t("carnet.saveSuccess")}
        </div>

        <QRDisplay
          qrDataUrl={created.qrDataUrl}
          carnetNumber={created.carnet.carnetNumber}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/dashboard/carnets/${created.carnet.id}/print`}
            className="btn-primary"
          >
            <Printer className="h-4 w-4" />
            {t("carnet.printQr")}
          </Link>
          <button onClick={() => router.push("/dashboard")} className="btn-secondary">
            <ArrowLeft className="h-4 w-4" />
            {t("carnet.backToList")}
          </button>
          <button onClick={() => setCreated(null)} className="btn-outline">
            <PlusCircle className="h-4 w-4" />
            {t("carnet.addAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t("carnet.newTitle")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("carnet.newSubtitle")}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="card p-6">
        <CarnetForm
          onSubmit={handleSubmit}
          submitLabel={t("carnet.saveAndCreateQr")}
          loading={loading}
        />
      </div>
    </div>
  );
}
