import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/auth";
import { FC, ReactNode } from "react";

interface LayoutDashboardDemoProps {
    children: ReactNode;
}

const LayoutDashboardDemo: FC<LayoutDashboardDemoProps> = async ({ children }) => {
    const session = await getSession();

    return <Sidebar user={session}>{children}</Sidebar>;
};

export default LayoutDashboardDemo;
