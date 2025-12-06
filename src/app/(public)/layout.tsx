// Public layout - no authentication required

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    // If authenticated, redirect to index
    if (session) {
        redirect("/panel");
    }

    return <>{children}</>;
}
