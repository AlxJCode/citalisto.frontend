"use client";

import { Layout, Menu } from "antd";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { usePathname } from "next/navigation";
import { items } from "../items";
import { Header } from "../Header";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BusinessCard } from "./BusinessCard";
import { SessionUser } from "@/lib/auth/types";
import styles from "./styles.module.css";

const { Sider, Content } = Layout;

// Memoized Logo component
const Logo = memo(({ collapsed }: { collapsed: boolean }) => {
    return (
        <div className={styles.logo}>
            {!collapsed && <span className={styles.logoText}>CitaListo</span>}
        </div>
    );
});

Logo.displayName = "Logo";

// Mapeo de rutas a keys del menú
const ROUTE_TO_MENU_KEY: Record<string, string> = {
    "/panel": "dashboard",
    "/bookings/calendar": "bookings",
    "/bookings/public-links": "bookings-public-links",
    "/bookings": "bookings-list",
    "/professionals": "professionals-list",
    "/professionals/availabilities": "professionals-availability",
    "/customers": "customers",
    "/services": "services",
    "/branches": "branches",
};

interface SidebarProps {
    children: React.ReactNode;
    user: SessionUser | null;
}

export const Sidebar = ({ children, user }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const pathname = usePathname();

    // Detectar automáticamente selectedKey basándose en la ruta actual
    const selectedKey = useMemo(() => {
        const menuKey = ROUTE_TO_MENU_KEY[pathname];
        if (menuKey) {
            return menuKey;
        }

        // Si no hay match exacto, intentar buscar por prefijo (para rutas dinámicas)
        const matchedRoute = Object.keys(ROUTE_TO_MENU_KEY).find((route) =>
            pathname.startsWith(route) && route !== "/"
        );

        if (matchedRoute) {
            return ROUTE_TO_MENU_KEY[matchedRoute];
        }

        // Default fallback
        return "dashboard";
    }, [pathname]);

    // Cerrar el menú móvil cuando cambia a desktop
    useEffect(() => {
        if (!isMobile && mobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    }, [isMobile, mobileMenuOpen]);

    // Prevenir scroll del body cuando el menú móvil está abierto
    useEffect(() => {
        if (isMobile && mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isMobile, mobileMenuOpen]);

    const toggleSidebar = useCallback(() => {
        if (isMobile) {
            setMobileMenuOpen((prev) => !prev);
        } else {
            setCollapsed((prev) => !prev);
        }
    }, [isMobile]);

    const handleMenuClick = useCallback(() => {
        if (isMobile) {
            setMobileMenuOpen(false);
        }
    }, [isMobile]);

    const handleBackdropClick = useCallback(() => {
        setMobileMenuOpen(false);
    }, []);

    // Memoize class names
    const siderClassName = useMemo(() => {
        const classes = [styles.sidebar];
        if (isMobile) classes.push(styles.sidebarMobile);
        if (isMobile && mobileMenuOpen) classes.push(styles.sidebarMobileOpen);
        return classes.join(" ");
    }, [isMobile, mobileMenuOpen]);

    // Memoize layout style
    const layoutStyle = useMemo(
        () => ({
            background: "#f8f8f8ff",
            marginLeft: isMobile ? 0 : collapsed ? 80 : 200,
            transition: "margin-left 0.2s",
        }),
        [isMobile, collapsed]
    );

    // Memoize content style
    const contentStyle = useMemo(
        () => ({
            marginTop: 64,
            marginBottom: isMobile ? 16 : 24,
            marginLeft: 0,
            marginRight: 0,
            padding: isMobile ? 16 : 24,
            minHeight: 280,
        }),
        [isMobile]
    );

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Backdrop para móviles */}
            {isMobile && mobileMenuOpen && (
                <div className={styles.backdrop} onClick={handleBackdropClick} />
            )}

            {/* Sidebar */}
            <Sider
                theme="light"
                collapsible={false}
                collapsed={isMobile ? false : collapsed}
                trigger={null}
                className={siderClassName}
                width={isMobile ? 280 : 200}
                collapsedWidth={isMobile ? 0 : 80}
                style={{
                    position: isMobile ? "absolute" : "fixed",
                    zIndex: isMobile ? 1000 : 100,
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                <Logo collapsed={isMobile ? false : collapsed} />
                <Menu
                    theme="light"
                    mode="inline"
                    items={items}
                    onClick={handleMenuClick}
                    selectedKeys={[selectedKey]}
                />
                <BusinessCard
                    businessName={user?.businessModel?.name || "Mi negocio"}
                    collapsed={isMobile ? false : collapsed}
                />
            </Sider>

            <Layout style={layoutStyle}>
                <Header
                    collapsed={collapsed}
                    mobileMenuOpen={mobileMenuOpen}
                    isMobile={isMobile}
                    onToggle={toggleSidebar}
                    user={user}
                />
                <Content style={contentStyle}>{children}</Content>
            </Layout>
        </Layout>
    );
};
