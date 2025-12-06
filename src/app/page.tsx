import { HeroCitaListo } from "@/components/ui/HeroCitaListo";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getSession();

    // If authenticated, redirect to panel
    if (session) {
        redirect("/panel");
    }

    // If not authenticated, show landing page
    return (
        <main className="min-h-screen flex items-center justify-center bg-white">
            <HeroCitaListo />
        </main>
    );
}
