import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-brand-light/20">
      <Navbar username={session?.username} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <DashboardClient />
      </main>
    </div>
  );
}
