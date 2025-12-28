import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/auth";

export default async function LayoutSettings({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    return <Sidebar user={session}>{children}</Sidebar>;
}
