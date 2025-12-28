"use client";

import { FC, useState } from "react";
import { Row, Col, Button } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    DollarOutlined,
    MessageOutlined,
    CloseCircleOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

import MetricCard from "@/components/dashboard/MetricCard";
import NextBookingsCard from "@/components/dashboard/NextBookingsCard";
import TopServicesCard from "@/components/dashboard/TopServicesCard";
import { PageContainer } from "@/components/layout/PageContainer";

dayjs.extend(relativeTime);
dayjs.locale("es");

const MOCK_DATA = {
    todayBookings: 5,
    nextBookingTime: "10:30 AM",
    pendingBookings: 3,
    pendingPercentage: 25,
    attendanceRate: 87,
    monthlyRevenue: 45500,
    whatsappUsed: 650,
    whatsappTotal: 1000,
    whatsappRemaining: 350,
    whatsappUsedPercent: 65,
    cancellations: 12,
    cancellationsPercentage: 8,
    nextBookings: [
        {
            id: "1",
            startTime: "2025-12-26T10:30:00",
            serviceName: "Limpieza dental",
            clientName: "María González",
            professionalName: "Dr. Pérez",
            status: "confirmed" as const,
        },
        {
            id: "2",
            startTime: "2025-12-26T14:00:00",
            serviceName: "Ortodoncia",
            clientName: "Carlos Ramírez",
            professionalName: "Dra. López",
            status: "pending" as const,
        },
        {
            id: "3",
            startTime: "2025-12-26T16:30:00",
            serviceName: "Blanqueamiento",
            clientName: "Ana Martínez",
            professionalName: "Dr. Pérez",
            status: "confirmed" as const,
        },
        {
            id: "4",
            startTime: "2025-12-27T09:00:00",
            serviceName: "Endodoncia",
            clientName: "Luis Torres",
            professionalName: "Dra. López",
            status: "pending" as const,
        },
        {
            id: "5",
            startTime: "2025-12-27T11:30:00",
            serviceName: "Implante dental",
            clientName: "Patricia Sánchez",
            professionalName: "Dr. Pérez",
            status: "confirmed" as const,
        },
    ],
    topServices: [
        {
            name: "Limpieza dental",
            bookings: 45,
            revenue: 13500,
        },
        {
            name: "Ortodoncia",
            bookings: 28,
            revenue: 16800,
        },
        {
            name: "Blanqueamiento",
            bookings: 22,
            revenue: 8800,
        },
    ],
};

const DashboardNewPage: FC = () => {
    const [lastUpdate, setLastUpdate] = useState(dayjs());
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setLastUpdate(dayjs());
            setRefreshing(false);
        }, 1000);
    };

    const getPendingColor = (percentage: number) => {
        if (percentage > 30) {
            return { bg: "#fff1f0", icon: "#ff4d4f" };
        }
        return { bg: "#fff7e6", icon: "#fa8c16" };
    };

    const getAttendanceColor = (rate: number) => {
        if (rate >= 80) {
            return { bg: "#f6ffed", icon: "#52c41a" };
        }
        if (rate >= 60) {
            return { bg: "#fffbe6", icon: "#faad14" };
        }
        return { bg: "#fff1f0", icon: "#ff4d4f" };
    };

    const getWhatsAppColor = (usedPercent: number) => {
        if (usedPercent < 70) {
            return { bg: "#f6ffed", icon: "#52c41a" };
        }
        if (usedPercent <= 85) {
            return { bg: "#fffbe6", icon: "#faad14" };
        }
        return { bg: "#fff1f0", icon: "#ff4d4f" };
    };

    const pendingColors = getPendingColor(MOCK_DATA.pendingPercentage);
    const attendanceColors = getAttendanceColor(MOCK_DATA.attendanceRate);
    const whatsappColors = getWhatsAppColor(MOCK_DATA.whatsappUsedPercent);

    return (
        <PageContainer
            title="Dashboard"
            description={`Actualizado ${lastUpdate.fromNow()}`}
            actions={[
                <Button
                    key="refresh"
                    type="text"
                    icon={<ReloadOutlined spin={refreshing} />}
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    Actualizar
                </Button>,
            ]}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12} lg={8}>
                    <MetricCard
                        icon={<CalendarOutlined />}
                        iconBgColor="#e6f4ff"
                        iconColor="#1890ff"
                        value={MOCK_DATA.todayBookings}
                        label="Citas de Hoy"
                        subtitle={`Próxima: ${MOCK_DATA.nextBookingTime}`}
                    />
                </Col>

                <Col xs={24} sm={12} md={12} lg={8}>
                    <MetricCard
                        icon={<ClockCircleOutlined />}
                        iconBgColor={pendingColors.bg}
                        iconColor={pendingColors.icon}
                        value={MOCK_DATA.pendingBookings}
                        label="Pendientes de Confirmar"
                        subtitle={`${MOCK_DATA.pendingPercentage}% del total`}
                    />
                </Col>

                <Col xs={24} sm={12} md={12} lg={8}>
                    <MetricCard
                        icon={<CheckCircleOutlined />}
                        iconBgColor={attendanceColors.bg}
                        iconColor={attendanceColors.icon}
                        value={`${MOCK_DATA.attendanceRate}%`}
                        label="Tasa de Asistencia"
                    />
                </Col>

                <Col xs={24} sm={12} md={12} lg={8}>
                    <MetricCard
                        icon={<DollarOutlined />}
                        iconBgColor="#f6ffed"
                        iconColor="#52c41a"
                        value={`$${MOCK_DATA.monthlyRevenue.toLocaleString()}`}
                        label="Ingresos del Mes"
                    />
                </Col>

                <Col xs={24} sm={12} md={12} lg={8}>
                    <MetricCard
                        icon={<MessageOutlined />}
                        iconBgColor={whatsappColors.bg}
                        iconColor={whatsappColors.icon}
                        value={`${MOCK_DATA.whatsappRemaining} restantes`}
                        label="Mensajes WhatsApp"
                        subtitle={`${MOCK_DATA.whatsappUsedPercent}% usado`}
                    />
                </Col>

                <Col xs={24} sm={12} md={12} lg={8}>
                    <MetricCard
                        icon={<CloseCircleOutlined />}
                        iconBgColor="#fff1f0"
                        iconColor="#ff4d4f"
                        value={MOCK_DATA.cancellations}
                        label="Cancelaciones (30 días)"
                        subtitle={`${MOCK_DATA.cancellationsPercentage}% del total`}
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                <Col xs={24} lg={14}>
                    <NextBookingsCard bookings={MOCK_DATA.nextBookings} />
                </Col>

                <Col xs={24} lg={10}>
                    <TopServicesCard services={MOCK_DATA.topServices} />
                </Col>
            </Row>
        </PageContainer>
    );
};

export default DashboardNewPage;
