import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-brand-light/20">
      <Navbar username={session.username} isAdmin />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <UsersClient />
      </main>
    </div>
  );
}
