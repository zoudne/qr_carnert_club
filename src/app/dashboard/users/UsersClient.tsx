"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { useTranslation } from "@/components/LocaleProvider";
import { formatDate } from "@/lib/carnet";
import { translateApiError } from "@/lib/translate-error";

interface AppUser {
  id: number;
  username: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  carnetsCount: number;
}

export default function UsersClient() {
  const { t, locale } = useTranslation();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(translateApiError(t, data));
        return;
      }

      setSuccess(true);
      e.currentTarget.reset();
      await fetchUsers();
    } catch {
      setError(t("errors.connectionError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t("users.title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("users.subtitle")}</p>
        </div>
      </div>

      <div className="mb-8 card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <UserPlus className="h-5 w-5 text-brand" />
          {t("users.addUser")}
        </h2>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {t("users.success")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              {t("users.username")}
            </label>
            <input name="username" required className="input-field" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              {t("users.password")}
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="input-field"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("form.saving")}
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  {t("users.addButton")}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin text-brand" />
          {t("dashboard.loading")}
        </div>
      ) : users.length === 0 ? (
        <div className="card p-12 text-center text-zinc-500">{t("users.noUsers")}</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-start text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">{t("users.username")}</th>
                  <th className="px-4 py-3.5 font-semibold">{t("users.role")}</th>
                  <th className="px-4 py-3.5 font-semibold">{t("users.carnetsCount")}</th>
                  <th className="px-4 py-3.5 font-semibold">{t("users.createdAt")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-light/20">
                    <td className="px-4 py-3.5 font-semibold">{user.username}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-brand-light text-brand"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {user.role === "ADMIN" ? t("users.admin") : t("users.userRole")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">{user.carnetsCount}</td>
                    <td className="px-4 py-3.5">
                      {formatDate(user.createdAt, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
