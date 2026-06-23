"use client";

import { CarnetFormData } from "@/lib/carnet";
import {
  Calendar,
  Car,
  FileText,
  Hash,
  Loader2,
  User,
} from "lucide-react";
import { useTranslation } from "./LocaleProvider";

interface CarnetFormProps {
  initialData?: CarnetFormData;
  onSubmit: (data: CarnetFormData) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
}

const emptyForm: CarnetFormData = {
  carnetNumber: "",
  expiryDate: "",
  ownerName: "",
  plateNumber: "",
  vin: "",
  carType: "",
};

const fields: {
  name: keyof CarnetFormData;
  labelKey: "form.carnetNumber" | "form.expiryDate" | "form.ownerName" | "form.plateNumber" | "form.vin" | "form.carType";
  icon: typeof FileText;
  type?: string;
}[] = [
  { name: "carnetNumber", labelKey: "form.carnetNumber", icon: FileText },
  { name: "expiryDate", labelKey: "form.expiryDate", icon: Calendar, type: "date" },
  { name: "ownerName", labelKey: "form.ownerName", icon: User },
  { name: "plateNumber", labelKey: "form.plateNumber", icon: Hash },
  { name: "vin", labelKey: "form.vin", icon: Hash },
  { name: "carType", labelKey: "form.carType", icon: Car },
];

export default function CarnetForm({
  initialData,
  onSubmit,
  submitLabel,
  loading,
}: CarnetFormProps) {
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onSubmit({
      carnetNumber: formData.get("carnetNumber") as string,
      expiryDate: formData.get("expiryDate") as string,
      ownerName: formData.get("ownerName") as string,
      plateNumber: formData.get("plateNumber") as string,
      vin: formData.get("vin") as string,
      carType: formData.get("carType") as string,
    });
  }

  const data = initialData || emptyForm;

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      {fields.map(({ name, labelKey, icon: Icon, type }) => (
        <div key={name}>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
            <Icon className="h-4 w-4 text-brand" />
            {t(labelKey)}
          </label>
          <input
            name={name}
            type={type ?? "text"}
            defaultValue={data[name]}
            required
            className="input-field"
          />
        </div>
      ))}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("form.saving")}
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
