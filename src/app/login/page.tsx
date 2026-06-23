"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, LogIn, User } from "lucide-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";
import { useTranslation } from "@/components/LocaleProvider";
import { translateApiError } from "@/lib/translate-error";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(translateApiError(t, data));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t("errors.connectionError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 via-brand-light to-zinc-50 px-4">
      <div className="card w-full max-w-md p-8 shadow-xl">
        <div className="mb-6 flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <Logo href="" size="lg" />
          <p className="mt-5 text-sm text-zinc-500">{t("login.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
              <User className="h-4 w-4 text-brand" />
              {t("login.username")}
            </label>
            <input
              name="username"
              required
              autoComplete="username"
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-700">
              <Lock className="h-4 w-4 text-brand" />
              {t("login.password")}
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input-field"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("login.submitting")}
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                {t("login.submit")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
