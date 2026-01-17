"use client";

import { Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useMemo, useCallback, memo } from "react";
import type { MenuProps } from "antd";
import { logoutAction } from "@/features/auth/actions/auth.actions";
import { useLoader } from "@/providers/LoaderProvider";
import styles from "./UserAvatar.module.css";
import Link from "next/link";

interface UserAvatarProps {
    userName?: string;
    userEmail?: string;
    userAvatar?: string | null;
}

const AVATAR_STYLE = {
    backgroundColor: "#1890ff",
    cursor: "pointer",
} as const;

export const UserAvatar = memo(({
    userName = "Usuario",
    userEmail = "usuario@email.com",
    userAvatar,
}: UserAvatarProps) => {
    const router = useRouter();
    const { showLoader } = useLoader();

    const getInitials = useCallback((name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }, []);

    const handleLogout = useCallback(async () => {
        showLoader("Cerrando sesión...");
        await logoutAction();
    }, [showLoader]);

    const handleProfileClick = useCallback(() => {
        router.push("/settings/profile");
    }, [router]);

    const handleSettingsClick = useCallback(() => {
        router.push("/settings");
    }, [router]);

    const menuItems: MenuProps["items"] = useMemo(
        () => [
            {
                key: "user-info",
                disabled: true,
                label: (
                    <div className={styles.dropdownInfo}>
                        <div className={styles.dropdownName}>{userName}</div>
                        <div className={styles.dropdownEmail}>{userEmail}</div>
                    </div>
                ),
            },
            {
                type: "divider",
            },
            {
                key: "profile",
                icon: <UserOutlined />,
                label: <Link href={"/settings/profile"}>
                    {"Mi perfil"}
                </Link>,
                
            },
            {
                key: "settings",
                icon: <SettingOutlined />,
                label: <Link href={"/settings"}>
                    {"Configuración"}
                </Link>,
                
            },
            {
                type: "divider",
            },
            {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Cerrar sesión",
                danger: true,
                onClick: handleLogout,
            },
        ],
        [userName, userEmail, handleProfileClick, handleSettingsClick, handleLogout]
    );

    const initials = useMemo(() => getInitials(userName), [userName, getInitials]);

    return (
        <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
            <div className={styles.wrapper}>
                <Avatar
                    size={36}
                    src={userAvatar}
                    icon={!userAvatar && <UserOutlined />}
                    style={userAvatar ? undefined : AVATAR_STYLE}
                >
                    {!userAvatar && initials}
                </Avatar>
            </div>
        </Dropdown>
    );
});

UserAvatar.displayName = "UserAvatar";
