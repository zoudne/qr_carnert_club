import type { Locale } from "@/i18n/config";

export type CarnetStatus = "active" | "expired";

export function getCarnetStatus(expiryDate: Date | string): CarnetStatus {
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return expiry >= today ? "active" : "expired";
}

export function formatDate(date: Date | string, locale: Locale = "ar") {
  return new Date(date).toLocaleDateString(
    locale === "ar" ? "ar-SA" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}

export interface CarnetFormData {
  carnetNumber: string;
  expiryDate: string;
  ownerName: string;
  plateNumber: string;
  vin: string;
  carType: string;
}
