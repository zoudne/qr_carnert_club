"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  LogOut,
  PlusCircle,
  User,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import { useTranslation } from "./LocaleProvider";

interface NavbarProps {
  username?: string;
}

export default function Navbar({ username }: NavbarProps) {
  const router = useRouter();
  const { t } = useTranslation();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Logo href="/dashboard" size="sm" />
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/dashboard"
              className="btn-ghost text-zinc-600 hover:bg-brand-light hover:text-brand"
            >
              <BookOpen className="h-4 w-4" />
              {t("nav.manageCarnets")}
            </Link>
            <Link
              href="/dashboard/carnets/new"
              className="btn-ghost text-zinc-600 hover:bg-brand-light hover:text-brand"
            >
              <PlusCircle className="h-4 w-4" />
              {t("nav.addCarnet")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {username && (
            <span className="hidden items-center gap-1.5 text-sm text-zinc-500 sm:flex">
              <User className="h-4 w-4" />
              {t("nav.welcome", { username })}
            </span>
          )}
          <button onClick={handleLogout} className="btn-secondary">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{t("nav.logout")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
