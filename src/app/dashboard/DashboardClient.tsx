"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2, PlusCircle, Search } from "lucide-react";
import CarnetTable from "@/components/CarnetTable";
import { useTranslation } from "@/components/LocaleProvider";

interface Carnet {
  id: number;
  carnetNumber: string;
  expiryDate: string;
  ownerName: string;
  plateNumber: string;
  vin: string;
  carType: string;
  createdAt: string;
  createdByUsername: string | null;
}

interface DashboardClientProps {
  isAdmin: boolean;
}

export default function DashboardClient({ isAdmin }: DashboardClientProps) {
  const { t } = useTranslation();
  const [carnets, setCarnets] = useState<Carnet[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCarnets = useCallback(async (query = "") => {
    setLoading(true);
    try {
      const url = query
        ? `/api/carnets?search=${encodeURIComponent(query)}`
        : "/api/carnets";
      const res = await fetch(url);
      const data = await res.json();
      setCarnets(data);
    } catch {
      setCarnets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarnets();
  }, [fetchCarnets]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCarnets(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchCarnets]);

  async function handleDelete(id: number) {
    const res = await fetch(`/api/carnets/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCarnets((prev) => prev.filter((c) => c.id !== id));
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t("dashboard.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("dashboard.subtitle")}</p>
        </div>
        <Link href="/dashboard/carnets/new" className="btn-primary">
          <PlusCircle className="h-4 w-4" />
          {t("dashboard.addNew")}
        </Link>
      </div>

      <div className="search-field mb-6">
        <Search className="h-5 w-5 shrink-0 text-zinc-400" aria-hidden />
        <input
          type="search"
          placeholder={t("dashboard.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
          {t("dashboard.loading")}
        </div>
      ) : (
        <CarnetTable
          carnets={carnets}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
