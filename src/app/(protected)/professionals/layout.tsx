import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/auth";

export default async function ProfessionalsLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    return <Sidebar user={session}>{children}</Sidebar>;
}
