import {
    DashboardOutlined,
    CalendarOutlined,
    TeamOutlined,
    ShopOutlined,
    UserOutlined,
    ClockCircleOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    LinkOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

export const items: MenuItem[] = [
    // Dashboard Principal
    {
        key: "dashboard",
        label: <Link href="/panel">Dashboard</Link>,
        icon: <DashboardOutlined />,
    },

    {
        type: "divider",
    },

    // Sección: Reservas
    {
        key: "bookings-group",
        label: "Reservas",
        type: "group",
    },
    {
        key: "bookings",
        label: <Link href="/bookings/calendar">Calendario</Link>,
        icon: <CalendarOutlined />,
    },
    {
        key: "bookings-list",
        label: <Link href="/bookings">Listado de Citas</Link>,
        icon: <ClockCircleOutlined />,
    },
    {
        key: "bookings-public-links",
        label: <Link href="/bookings/public-links">Generar links</Link>,
        icon: <LinkOutlined />,
    },

    {
        type: "divider",
    },

    // Sección: Gestión
    {
        key: "management-group",
        label: "Gestión",
        type: "group",
    },
    {
        key: "professionals",
        label: "Profesionales",
        icon: <TeamOutlined />,
        children: [
            {
                key: "professionals-list",
                label: <Link href="/professionals">Listado</Link>,
            },
            {
                key: "professionals-availability",
                label: <Link href="/professionals/availabilities">Disponibilidad</Link>,
            },
        ],
    },
    {
        key: "customers",
        label: <Link href="/customers">Clientes</Link>,
        icon: <UserOutlined />,
    },
    {
        key: "services",
        label: <Link href="/services">Servicios</Link>,
        icon: <AppstoreOutlined />,
    },
    {
        key: "branches",
        label: <Link href="/branches">Sedes</Link>,
        icon: <ShopOutlined />,
    },

    {
        type: "divider",
    },

    // Sección: Reportes
    /* {
        key: "reports-group",
        label: "Reportes",
        type: "group",
    },
    {
        key: "reports",
        label: "Estadísticas",
        icon: <BarChartOutlined />,
        children: [
            {
                key: "reports-revenue",
                label: <Link href="/reports/revenue">Ingresos</Link>,
            },
            {
                key: "reports-bookings",
                label: <Link href="/reports/bookings">Reservas</Link>,
            },
            {
                key: "reports-customers",
                label: <Link href="/reports/customers">Clientes</Link>,
            },
        ],
    }, */

    /* {
        type: "divider",
        style: { margin: 16 },
    },

    // Configuración
    {
        key: "settings-group",
        label: "Configuración",
        type: "group",
    },
    {
        key: "settings",
        label: "Ajustes",
        icon: <SettingOutlined />,
        children: [
            {
                key: "settings-business",
                label: <Link href="/settings/business">Mi Negocio</Link>,
            },
            {
                key: "settings-users",
                label: <Link href="/settings/users">Usuarios</Link>,
            },
            {
                key: "settings-notifications",
                label: <Link href="/settings/notifications">Notificaciones</Link>,
            },
        ],
    }, */
];
