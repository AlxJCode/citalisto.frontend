// Protected layout - requires authentication

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Sidebar } from "@/components/layout";

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    // Redirect to login if not authenticated
    if (!session) {
        redirect("/login");
    }

    return <>{children}</>;
}
