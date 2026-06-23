"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Trash2, UserPlus, X } from "lucide-react";
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
  const [success, setSuccess] = useState("");
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

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

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearMessages();
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

      setSuccess(t("users.success"));
      e.currentTarget.reset();
      await fetchUsers();
    } catch {
      setError(t("errors.connectionError"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingUser) return;

    clearMessages();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: password || undefined,
          role: formData.get("role"),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(translateApiError(t, data));
        return;
      }

      setSuccess(t("users.updateSuccess"));
      setEditingUser(null);
      await fetchUsers();
    } catch {
      setError(t("errors.connectionError"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    clearMessages();
    setDeletingId(id);

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setError(translateApiError(t, data));
        return;
      }

      setSuccess(t("users.deleteSuccess"));
      if (editingUser?.id === id) {
        setEditingUser(null);
      }
      await fetchUsers();
    } catch {
      setError(t("errors.connectionError"));
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
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

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="mb-8 card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <UserPlus className="h-5 w-5 text-brand" />
          {t("users.addUser")}
        </h2>

        <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
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
              {submitting && !editingUser ? (
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

      {editingUser && (
        <div className="mb-8 card border-brand/30 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Pencil className="h-5 w-5 text-brand" />
            {t("users.editUser")}
          </h2>

          <form onSubmit={handleUpdate} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                {t("users.username")}
              </label>
              <input
                name="username"
                required
                defaultValue={editingUser.username}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                {t("users.newPassword")}
              </label>
              <input
                name="password"
                type="password"
                minLength={6}
                placeholder={t("users.newPasswordHint")}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                {t("users.role")}
              </label>
              <select
                name="role"
                defaultValue={editingUser.role}
                className="input-field"
              >
                <option value="USER">{t("users.userRole")}</option>
                <option value="ADMIN">{t("users.admin")}</option>
              </select>
            </div>
            <div className="flex flex-wrap items-end gap-2 sm:col-span-2">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("form.saving")}
                  </>
                ) : (
                  t("users.saveChanges")
                )}
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="btn-ghost bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              >
                <X className="h-4 w-4" />
                {t("users.cancelEdit")}
              </button>
            </div>
          </form>
        </div>
      )}

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
            <table className="w-full min-w-[800px] text-start text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">{t("users.username")}</th>
                  <th className="px-4 py-3.5 font-semibold">{t("users.role")}</th>
                  <th className="px-4 py-3.5 font-semibold">{t("users.carnetsCount")}</th>
                  <th className="px-4 py-3.5 font-semibold">{t("users.createdAt")}</th>
                  <th className="px-4 py-3.5 font-semibold">{t("users.actions")}</th>
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
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            clearMessages();
                            setEditingUser(user);
                          }}
                          className="btn-ghost bg-brand-light text-brand hover:bg-brand hover:text-white"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          {t("users.edit")}
                        </button>
                        {user.role !== "ADMIN" &&
                          (confirmDeleteId === user.id ? (
                            <>
                              <button
                                onClick={() => handleDelete(user.id)}
                                disabled={deletingId === user.id}
                                className="btn-ghost bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                              >
                                {deletingId === user.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                                {t("users.confirmDelete")}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="btn-ghost bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                              >
                                <X className="h-3.5 w-3.5" />
                                {t("users.cancelEdit")}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                clearMessages();
                                setConfirmDeleteId(user.id);
                              }}
                              className="btn-ghost bg-red-50 text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {t("users.delete")}
                            </button>
                          ))}
                      </div>
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
