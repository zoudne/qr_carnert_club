"use client";

import { useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { useTranslation } from "@/components/LocaleProvider";
import { translateApiError } from "@/lib/translate-error";

export default function SettingsClient() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.get("currentPassword"),
          newPassword: formData.get("newPassword"),
          confirmPassword: formData.get("confirmPassword"),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(translateApiError(t, data));
        return;
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch {
      setError(t("errors.connectionError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t("settings.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("settings.subtitle")}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {t("settings.success")}
        </div>
      )}

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
              <KeyRound className="h-4 w-4 text-brand" />
              {t("settings.currentPassword")}
            </label>
            <input
              name="currentPassword"
              type="password"
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              {t("settings.newPassword")}
            </label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={6}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              {t("settings.confirmPassword")}
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("form.saving")}
              </>
            ) : (
              t("settings.submit")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
