import { getSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import NewCarnetClient from "./NewCarnetClient";

export default async function NewCarnetPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-brand-light/20">
      <Navbar username={session?.username} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <NewCarnetClient />
      </main>
    </div>
  );
}
