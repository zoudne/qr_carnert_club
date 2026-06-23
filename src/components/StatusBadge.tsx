"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { CarnetStatus } from "@/lib/carnet";
import { useTranslation } from "./LocaleProvider";

interface StatusBadgeProps {
  status: CarnetStatus;
  large?: boolean;
}

export default function StatusBadge({ status, large }: StatusBadgeProps) {
  const { t } = useTranslation();
  const isActive = status === "active";
  const Icon = isActive ? CheckCircle2 : XCircle;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold ${
        large ? "px-6 py-3 text-lg" : "px-3 py-1 text-sm"
      } ${
        isActive
          ? "bg-green-100 text-green-800 ring-2 ring-green-300"
          : "bg-red-100 text-red-800 ring-2 ring-red-300"
      }`}
    >
      <Icon className={large ? "h-5 w-5" : "h-4 w-4"} />
      {isActive ? t("status.active") : t("status.expired")}
    </span>
  );
}
