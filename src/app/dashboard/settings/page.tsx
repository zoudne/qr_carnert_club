import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-brand-light/20">
      <Navbar username={session?.username} isAdmin={session?.role === "ADMIN"} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <SettingsClient />
      </main>
    </div>
  );
}
