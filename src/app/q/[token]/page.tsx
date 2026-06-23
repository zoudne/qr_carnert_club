import { notFound } from "next/navigation";
import {
  Calendar,
  Car,
  CarFront,
  FileText,
  Hash,
  Home,
  User,
} from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";
import StatusBadge from "@/components/StatusBadge";
import { createTranslator } from "@/i18n";
import { formatDate, getCarnetStatus } from "@/lib/carnet";
import { getHomeUrl } from "@/lib/home-url";
import { getLocale } from "@/lib/locale";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ token: string }> };

export default async function PublicCarnetPage({ params }: PageProps) {
  const { token } = await params;
  const locale = await getLocale();
  const t = createTranslator(locale);

  const carnet = await prisma.carnet.findUnique({
    where: { qrToken: token },
    select: {
      carnetNumber: true,
      expiryDate: true,
      ownerName: true,
      plateNumber: true,
      vin: true,
      carType: true,
    },
  });

  if (!carnet) {
    notFound();
  }

  const status = getCarnetStatus(carnet.expiryDate);
  const homeUrl = getHomeUrl();

  const fields = [
    { icon: FileText, label: t("form.carnetNumber"), value: carnet.carnetNumber, large: true },
    { icon: Calendar, label: t("form.expiryDate"), value: formatDate(carnet.expiryDate, locale) },
    { icon: User, label: t("form.ownerName"), value: carnet.ownerName },
    { icon: CarFront, label: t("form.carType"), value: carnet.carType },
    { icon: Car, label: t("form.plateNumber"), value: carnet.plateNumber },
    { icon: Hash, label: t("form.vin"), value: carnet.vin, mono: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-brand-light to-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex items-center justify-between">
          <Logo size="sm" />
          <LanguageSwitcher />
        </div>

        <div className="card overflow-hidden shadow-xl">
          <div
            className={`px-6 py-8 text-center ${
              status === "active"
                ? "bg-gradient-to-r from-green-600 to-green-700"
                : "bg-gradient-to-r from-brand to-brand-hover"
            }`}
          >
            <h1 className="text-xl font-bold text-white">{t("carnet.carnetBook")}</h1>
            <div className="mt-4 flex justify-center">
              <StatusBadge status={status} large />
            </div>
          </div>

          <div className="space-y-5 p-6">
            <h2 className="text-lg font-semibold text-zinc-900">
              {t("carnet.carnetData")}
            </h2>

            <dl className="space-y-3">
              {fields.map(({ icon: Icon, label, value, large, mono }) => (
                <div key={label} className="rounded-xl bg-zinc-50 p-4">
                  <dt className="flex items-center gap-2 text-sm text-zinc-500">
                    <Icon className="h-4 w-4 text-brand" />
                    {label}
                  </dt>
                  <dd
                    className={`mt-1 font-semibold text-zinc-900 ${
                      large ? "text-lg font-bold" : ""
                    } ${mono ? "font-mono" : ""}`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div
              className={`rounded-xl p-4 text-center font-medium ${
                status === "active"
                  ? "border border-green-200 bg-green-50 text-green-800"
                  : "border border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {status === "active"
                ? t("carnet.activeMessage")
                : t("carnet.expiredMessage")}
            </div>

            <a href={homeUrl} className="btn-primary w-full py-3">
              <Home className="h-4 w-4" />
              {t("carnet.backToHome")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
