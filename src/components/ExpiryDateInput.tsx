"use client";

import {
  MAX_EXPIRY_YEAR,
  MIN_EXPIRY_YEAR,
  buildExpiryDate,
  getInitialDateParts,
} from "@/lib/carnet";
import { useState } from "react";
import { useTranslation } from "./LocaleProvider";

interface ExpiryDateInputProps {
  name?: string;
  defaultValue?: string;
  error?: string;
  onBlur?: (value: string) => void;
}

function sanitizeDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

function clampDay(value: string) {
  const digits = sanitizeDigits(value, 2);
  if (!digits) {
    return "";
  }

  if (digits.length === 2) {
    const day = parseInt(digits, 10);
    if (day < 1) {
      return digits.slice(0, 1);
    }
    if (day > 31) {
      return "31";
    }
  }

  return digits;
}

function clampMonth(value: string) {
  const digits = sanitizeDigits(value, 2);
  if (!digits) {
    return "";
  }

  if (digits.length === 2) {
    const month = parseInt(digits, 10);
    if (month < 1) {
      return digits.slice(0, 1);
    }
    if (month > 12) {
      return "12";
    }
  }

  return digits;
}

export default function ExpiryDateInput({
  name = "expiryDate",
  defaultValue = "",
  error,
  onBlur,
}: ExpiryDateInputProps) {
  const { t } = useTranslation();
  const initial = getInitialDateParts(defaultValue);
  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);

  const isoValue = buildExpiryDate(day, month, year);

  const cells = [
    {
      key: "day",
      label: t("date.day"),
      value: day,
      width: "w-14",
      placeholder: "DD",
      onChange: (value: string) => setDay(clampDay(value)),
    },
    {
      key: "month",
      label: t("date.month"),
      value: month,
      width: "w-14",
      placeholder: "MM",
      onChange: (value: string) => setMonth(clampMonth(value)),
    },
    {
      key: "year",
      label: t("date.year"),
      value: year,
      width: "w-[4.5rem]",
      placeholder: "YYYY",
      onChange: (value: string) => setYear(sanitizeDigits(value, 4)),
    },
  ];

  return (
    <div>
      <div
        className="inline-flex gap-2"
        dir="ltr"
        onBlur={() => onBlur?.(isoValue)}
      >
        {cells.map(({ key, label, value, width, placeholder, onChange }) => (
          <div
            key={key}
            className={`flex flex-col items-center rounded-lg border bg-white text-center ${width} px-3 py-2 ${
              error ? "border-red-300" : "border-zinc-200"
            }`}
          >
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
              {label}
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 w-full border-0 bg-transparent p-0 text-center text-lg font-semibold tabular-nums text-zinc-900 outline-none placeholder:text-zinc-300"
              aria-label={label}
            />
          </div>
        ))}
      </div>
      <input type="hidden" name={name} value={isoValue} />
      <p className="mt-2 text-xs text-zinc-400">
        {t("form.expiryDateHint", {
          minYear: String(MIN_EXPIRY_YEAR),
          maxYear: String(MAX_EXPIRY_YEAR),
        })}
      </p>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
