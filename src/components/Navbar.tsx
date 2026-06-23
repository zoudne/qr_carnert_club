"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  LogOut,
  PlusCircle,
  Settings,
  User,
  Users,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import { useTranslation } from "./LocaleProvider";

interface NavbarProps {
  username?: string;
  isAdmin?: boolean;
}

export default function Navbar({ username, isAdmin }: NavbarProps) {
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
        <div className="flex items-center gap-4 lg:gap-6">
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
            {isAdmin && (
              <Link
                href="/dashboard/users"
                className="btn-ghost text-zinc-600 hover:bg-brand-light hover:text-brand"
              >
                <Users className="h-4 w-4" />
                {t("nav.users")}
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <Link
            href="/dashboard/settings"
            className="btn-ghost text-zinc-600 hover:bg-brand-light hover:text-brand"
            title={t("nav.settings")}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden lg:inline">{t("nav.settings")}</span>
          </Link>
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
