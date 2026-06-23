"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Loader2, Printer, Trash2, X } from "lucide-react";
import { formatDate, getCarnetStatus } from "@/lib/carnet";
import { useTranslation } from "./LocaleProvider";
import StatusBadge from "./StatusBadge";

interface Carnet {
  id: number;
  carnetNumber: string;
  expiryDate: string;
  ownerName: string;
  plateNumber: string;
  vin: string;
  carType: string;
}

interface CarnetTableProps {
  carnets: Carnet[];
  onDelete: (id: number) => Promise<void>;
}

export default function CarnetTable({ carnets, onDelete }: CarnetTableProps) {
  const { t, locale } = useTranslation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  if (carnets.length === 0) {
    return (
      <div className="card border-dashed p-12 text-center text-zinc-500">
        {t("carnet.noCarnets")}
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-start text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3.5 font-semibold">{t("table.carnetNumber")}</th>
              <th className="px-4 py-3.5 font-semibold">{t("table.owner")}</th>
              <th className="px-4 py-3.5 font-semibold">{t("table.plateNumber")}</th>
              <th className="px-4 py-3.5 font-semibold">{t("table.vin")}</th>
              <th className="px-4 py-3.5 font-semibold">{t("table.expiryDate")}</th>
              <th className="px-4 py-3.5 font-semibold">{t("table.status")}</th>
              <th className="px-4 py-3.5 font-semibold">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {carnets.map((carnet) => (
              <tr key={carnet.id} className="transition-colors hover:bg-brand-light/30">
                <td className="px-4 py-3.5 font-semibold text-zinc-900">
                  {carnet.carnetNumber}
                </td>
                <td className="px-4 py-3.5">{carnet.ownerName}</td>
                <td className="px-4 py-3.5">{carnet.plateNumber}</td>
                <td className="px-4 py-3.5 font-mono text-xs">{carnet.vin}</td>
                <td className="px-4 py-3.5">
                  {formatDate(carnet.expiryDate, locale)}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={getCarnetStatus(carnet.expiryDate)} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/carnets/${carnet.id}`}
                      className="btn-ghost bg-brand-light text-brand hover:bg-brand hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t("table.view")}
                    </Link>
                    <Link
                      href={`/dashboard/carnets/${carnet.id}/print`}
                      className="btn-ghost bg-zinc-100 text-zinc-700 hover:bg-zinc-800 hover:text-white"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      {t("table.printQr")}
                    </Link>
                    {confirmId === carnet.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(carnet.id)}
                          disabled={deletingId === carnet.id}
                          className="btn-ghost bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingId === carnet.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          {t("table.confirmDelete")}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="btn-ghost bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        >
                          <X className="h-3.5 w-3.5" />
                          {t("table.cancel")}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmId(carnet.id)}
                        className="btn-ghost bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("table.delete")}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
