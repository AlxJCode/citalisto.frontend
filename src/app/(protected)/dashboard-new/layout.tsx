import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/auth";
import { FC, ReactNode } from "react";

interface LayoutDashboardNewProps {
    children: ReactNode;
}

const LayoutDashboardNew: FC<LayoutDashboardNewProps> = async ({ children }) => {
    const session = await getSession();

    return <Sidebar user={session}>{children}</Sidebar>;
};

export default LayoutDashboardNew;
