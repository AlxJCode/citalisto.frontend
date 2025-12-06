"use client";

import { Breadcrumb, Layout, Button } from "antd";
import { HomeOutlined, MenuOutlined, SwapLeftOutlined, SwapRightOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { useMemo, memo } from "react";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import { SessionUser } from "@/lib/auth/types";
import styles from "./Header.module.css";

const { Header: AntHeader } = Layout;

// Mapeo de rutas a nombres legibles
const routeNames: Record<string, string> = {
    dashboard: "Dashboard",
    bookings: "Reservas",
    calendar: "Calendario",
    professionals: "Profesionales",
    "professionals/availabilities": "Disponibilidad",
    "bookings/calendar": "Calendario",
    customers: "Clientes",
    services: "Servicios",
    branches: "Sedes",
    reports: "Reportes",
    revenue: "Ingresos",
    settings: "Configuración",
    business: "Mi Negocio",
    users: "Usuarios",
    notifications: "Notificaciones",
};

interface HeaderProps {
    collapsed: boolean;
    mobileMenuOpen: boolean;
    isMobile: boolean;
    onToggle: () => void;
    user: SessionUser | null;
}

export const Header = memo(
    ({ collapsed, mobileMenuOpen, isMobile, onToggle, user }: HeaderProps) => {
        const pathname = usePathname();

        // Memoize breadcrumb items
        const breadcrumbItems = useMemo(() => {
            const pathSegments = pathname.split("/").filter(Boolean);

            return [
                {
                    title: (
                        <Link href="/">
                            <HomeOutlined />
                        </Link>
                    ),
                },
                ...pathSegments.map((segment, index) => {
                    const url = "/" + pathSegments.slice(0, index + 1).join("/");
                    const isLast = index === pathSegments.length - 1;

                    // Usar la ruta acumulativa completa
                    const routeKey = pathSegments.slice(0, index + 1).join("/");
                    const title = routeNames[routeKey] || segment.charAt(0).toUpperCase() + segment.slice(1);

                    return {
                        title: isLast ? title : <Link href={url}>{title}</Link>,
                    };
                }),
            ];
        }, [pathname]);

        // Memoize toggle icon
        const toggleIcon = useMemo(() => {
            if (isMobile) return <MenuOutlined />;
            return collapsed ? <SwapRightOutlined /> : <SwapLeftOutlined />;
        }, [isMobile, collapsed]);

        // Memoize header style
        const headerStyle = useMemo(
            () => ({
                left: isMobile ? 0 : collapsed ? 80 : 200,
            }),
            [isMobile, collapsed]
        );

        const fullName = user ? `${user.firstName} ${user.lastName}` : "Usuario";

        return (
            <AntHeader className={styles.header} style={headerStyle}>
                <div className={styles.headerLeft}>
                    <Button type="primary" icon={toggleIcon} onClick={onToggle} />
                    <Breadcrumb items={breadcrumbItems} />
                </div>
                <UserAvatar
                    userName={fullName}
                    userEmail={user?.email || ""}
                    userAvatar={user?.profilePicture}
                />
            </AntHeader>
        );
    }
);

Header.displayName = "Header";
