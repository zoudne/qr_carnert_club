import type { Locale } from "@/i18n/config";

export type CarnetStatus = "active" | "expired";

export function getCarnetStatus(expiryDate: Date | string): CarnetStatus {
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return expiry >= today ? "active" : "expired";
}

export function parseDateParts(date: Date | string) {
  const parsed =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)
      ? (() => {
          const [year, month, day] = date
            .split("T")[0]
            .split("-")
            .map(Number);
          return new Date(year, month - 1, day);
        })()
      : new Date(date);

  return {
    day: String(parsed.getDate()).padStart(2, "0"),
    month: String(parsed.getMonth() + 1).padStart(2, "0"),
    year: String(parsed.getFullYear()),
  };
}

export function formatDate(date: Date | string, _locale?: Locale) {
  const { day, month, year } = parseDateParts(date);
  return `${day}/${month}/${year}`;
}

export function buildExpiryDate(day: string, month: string, year: string): string {
  if (!day || !month || year.length < 4) {
    return "";
  }

  return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function getInitialDateParts(defaultValue?: string) {
  if (!defaultValue || !isValidExpiryDate(defaultValue)) {
    return { day: "", month: "", year: "" };
  }

  return parseDateParts(defaultValue);
}

export interface CarnetFormData {
  carnetNumber: string;
  expiryDate: string;
  ownerName: string;
  plateNumber: string;
  vin: string;
  carType: string;
}

export const MIN_EXPIRY_YEAR = 2000;
export const MAX_EXPIRY_YEAR = 2100;

export function getExpiryDateInputBounds() {
  return {
    min: `${MIN_EXPIRY_YEAR}-01-01`,
    max: `${MAX_EXPIRY_YEAR}-12-31`,
  };
}

export function isValidExpiryDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (year < MIN_EXPIRY_YEAR || year > MAX_EXPIRY_YEAR) {
    return false;
  }
  if (month < 1 || month > 12) {
    return false;
  }
  if (day < 1 || day > 31) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function parseExpiryDate(value: string): Date | null {
  if (!isValidExpiryDate(value)) {
    return null;
  }

  const [yearStr, monthStr, dayStr] = value.split("-");
  return new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
}
