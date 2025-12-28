"use client";

import { ReactNode } from 'react';
import { Layout, Menu } from 'antd';
import { SettingOutlined, UserOutlined, ShopOutlined, LockOutlined, BellOutlined, CreditCardOutlined, TeamOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

const { Sider, Content } = Layout;

interface SettingsLayoutProps {
    children: ReactNode;
}

const menuItems = [
    {
        key: '/settings',
        icon: <SettingOutlined />,
        label: <Link href="/settings">General</Link>,
    },
    {
        key: '/settings/profile',
        icon: <UserOutlined />,
        label: <Link href="/settings/profile">Mi Perfil</Link>,
    },
    {
        key: '/settings/business',
        icon: <ShopOutlined />,
        label: <Link href="/settings/business">Mi Negocio</Link>,
    },
    {
        key: '/settings/team',
        icon: <TeamOutlined />,
        label: <Link href="/settings/team">Equipo</Link>,
    },
    {
        key: '/settings/security',
        icon: <LockOutlined />,
        label: <Link href="/settings/security">Seguridad</Link>,
    },
    {
        key: '/settings/notifications',
        icon: <BellOutlined />,
        label: <Link href="/settings/notifications">Notificaciones</Link>,
    },
    {
        key: '/settings/billing',
        icon: <CreditCardOutlined />,
        label: <Link href="/settings/billing">Facturación</Link>,
    },
];

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    const pathname = usePathname();
    const selectedKey = pathname || '/settings';

    return (
        <div className={styles.container}>
            {/* Mobile Menu - Horizontal */}
            <div className={styles.mobileMenuWrapper}>
                <Menu
                    mode="horizontal"
                    selectedKeys={[selectedKey]}
                    items={menuItems}
                    className={styles.mobileMenu}
                />
            </div>

            {/* Layout - Two Columns (Desktop) / Single Column (Mobile) */}
            <div className={styles.layout}>
                <div className={styles.sidebarColumn}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        items={menuItems}
                        className={styles.desktopMenu}
                    />
                </div>
                <div className={styles.contentColumn}>
                    {children}
                </div>
            </div>
        </div>
    );
}
