"use client";

import { Avatar, Dropdown } from "antd";
import { SettingOutlined, MoreOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useMemo, useCallback, memo } from "react";
import type { MenuProps } from "antd";
import styles from "./BusinessCard.module.css";
import Link from "next/link";

interface BusinessCardProps {
    businessName?: string;
    businessLogo?: string | null;
    collapsed: boolean;
}

const AVATAR_STYLE = {
    backgroundColor: "var(--ant-primary-color)",
    cursor: "pointer",
} as const;

const AVATAR_STYLE_EXPANDED = {
    backgroundColor: "var(--ant-primary-color)",
} as const;

export const BusinessCard = memo(({
    businessName = "Mi Negocio",
    businessLogo,
    collapsed,
}: BusinessCardProps) => {
    const router = useRouter();

    const getInitial = useCallback((name: string) => {
        return name.charAt(0).toUpperCase();
    }, []);

    const handleSettingsClick = useCallback(() => {
        router.push("/settings/business");
    }, [router]);

    const menuItems: MenuProps["items"] = useMemo(
        () => [
            {
                key: "settings",
                icon: <SettingOutlined />,
                label: <Link href={"/settings"}>
                    {"Ajustes del negocio"}
                </Link>,
                
            },
        ],
        [handleSettingsClick]
    );

    const initial = useMemo(() => getInitial(businessName), [businessName, getInitial]);

    const avatarContent = useMemo(
        () => (
            <Avatar size={40} src={businessLogo} style={AVATAR_STYLE}>
                {!businessLogo && initial}
            </Avatar>
        ),
        [businessLogo, initial]
    );

    if (collapsed) {
        return (
            <div className={styles.collapsed}>
                <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="topRight">
                    {avatarContent}
                </Dropdown>
            </div>
        );
    }

    return (
        <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="topRight">
            <div className={styles.card}>
                <div className={styles.content}>
                    <Avatar size={40} src={businessLogo} style={AVATAR_STYLE_EXPANDED}>
                        {!businessLogo && initial}
                    </Avatar>
                    <div className={styles.info}>
                        <span className={styles.name}>{businessName}</span>
                    </div>
                </div>
                <MoreOutlined className={styles.more} />
            </div>
        </Dropdown>
    );
});

BusinessCard.displayName = "BusinessCard";
