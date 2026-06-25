"use client";

import { parseDateParts } from "@/lib/carnet";
import { useTranslation } from "./LocaleProvider";

interface DateDisplayProps {
  date: Date | string;
  compact?: boolean;
}

export default function DateDisplay({ date, compact = false }: DateDisplayProps) {
  const { t } = useTranslation();
  const { day, month, year } = parseDateParts(date);

  const cells = [
    { key: "day", label: t("date.day"), value: day, width: compact ? "w-10" : "w-14" },
    { key: "month", label: t("date.month"), value: month, width: compact ? "w-10" : "w-14" },
    { key: "year", label: t("date.year"), value: year, width: compact ? "w-14" : "w-[4.5rem]" },
  ];

  return (
    <div
      className={`inline-flex ${compact ? "gap-1" : "gap-2"}`}
      dir="ltr"
      aria-label={`${day}/${month}/${year}`}
    >
      {cells.map(({ key, label, value, width }) => (
        <div
          key={key}
          className={`flex flex-col items-center rounded-lg border border-zinc-200 bg-white text-center ${width} ${
            compact ? "px-1.5 py-1" : "px-3 py-2"
          }`}
        >
          <span
            className={`font-medium uppercase tracking-wider text-zinc-400 ${
              compact ? "text-[9px] leading-tight" : "text-[10px] leading-tight"
            }`}
          >
            {label}
          </span>
          <span
            className={`tabular-nums font-semibold text-zinc-900 ${
              compact ? "mt-0.5 text-sm" : "mt-1 text-lg"
            }`}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
