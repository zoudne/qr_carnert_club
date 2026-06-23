"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Printer,
} from "lucide-react";
import CarnetForm from "@/components/CarnetForm";
import { useTranslation } from "@/components/LocaleProvider";
import QRDisplay from "@/components/QRDisplay";
import StatusBadge from "@/components/StatusBadge";
import { CarnetFormData, formatDate, getCarnetStatus } from "@/lib/carnet";
import { translateApiError } from "@/lib/translate-error";

interface CarnetDetailClientProps {
  carnet: CarnetFormData & { id: number };
  qrDataUrl: string;
}

export default function CarnetDetailClient({
  carnet: initialCarnet,
  qrDataUrl: initialQr,
}: CarnetDetailClientProps) {
  const { t, locale } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [carnet, setCarnet] = useState(initialCarnet);
  const [qrDataUrl, setQrDataUrl] = useState(initialQr);

  async function handleUpdate(data: CarnetFormData) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/carnets/${carnet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(translateApiError(t, result));
        return;
      }

      setCarnet({
        id: result.carnet.id,
        carnetNumber: result.carnet.carnetNumber,
        expiryDate: result.carnet.expiryDate.split("T")[0],
        ownerName: result.carnet.ownerName,
        plateNumber: result.carnet.plateNumber,
        vin: result.carnet.vin,
        carType: result.carnet.carType,
      });
      setQrDataUrl(result.qrDataUrl);
      setEditing(false);
    } catch {
      setError(t("errors.connectionError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {t("carnet.detailsTitle")}
          </h1>
          <p className="mt-1 font-mono text-sm text-zinc-500">
            {carnet.carnetNumber}
          </p>
        </div>
        <StatusBadge status={getCarnetStatus(carnet.expiryDate)} large />
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/dashboard" className="btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          {t("carnet.backToList")}
        </Link>
        <Link
          href={`/dashboard/carnets/${carnet.id}/print`}
          className="btn-primary"
        >
          <Printer className="h-4 w-4" />
          {t("carnet.printQr")}
        </Link>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-outline">
            <Pencil className="h-4 w-4" />
            {t("carnet.editData")}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          {editing ? (
            <>
              <h2 className="mb-4 text-lg font-semibold">{t("carnet.editTitle")}</h2>
              <CarnetForm
                initialData={carnet}
                onSubmit={handleUpdate}
                submitLabel={t("carnet.saveChanges")}
                loading={loading}
              />
              <button
                onClick={() => setEditing(false)}
                className="mt-4 text-sm text-zinc-500 hover:text-zinc-700"
              >
                {t("carnet.cancelEdit")}
              </button>
            </>
          ) : (
            <dl className="space-y-4">
              <div className="rounded-xl bg-zinc-50 p-4">
                <dt className="text-sm text-zinc-500">{t("table.carnetNumber")}</dt>
                <dd className="mt-1 font-semibold">{carnet.carnetNumber}</dd>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4">
                <dt className="text-sm text-zinc-500">{t("table.expiryDate")}</dt>
                <dd className="mt-1 font-semibold">
                  {formatDate(carnet.expiryDate, locale)}
                </dd>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4">
                <dt className="text-sm text-zinc-500">{t("form.ownerName")}</dt>
                <dd className="mt-1 font-semibold">{carnet.ownerName}</dd>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4">
                <dt className="text-sm text-zinc-500">{t("form.plateNumber")}</dt>
                <dd className="mt-1 font-semibold">{carnet.plateNumber}</dd>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4">
                <dt className="text-sm text-zinc-500">{t("form.vin")}</dt>
                <dd className="font-mono font-semibold">{carnet.vin}</dd>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4">
                <dt className="text-sm text-zinc-500">{t("form.carType")}</dt>
                <dd className="mt-1 font-semibold">{carnet.carType}</dd>
              </div>
            </dl>
          )}
        </div>

        <QRDisplay qrDataUrl={qrDataUrl} carnetNumber={carnet.carnetNumber} />
      </div>
    </div>
  );
}
