"use client";

import { useEffect } from 'react';
import { Row, Col, Card, Skeleton, Empty, Button } from 'antd';
import {
    CalendarOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    RiseOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { RevenueCard } from '@/features/dashboard/components/RevenueCard';
import { WhatsAppUsageCard } from '@/features/dashboard/components/WhatsAppUsageCard';
import { AttendanceCard } from '@/features/dashboard/components/AttendanceCard';
import { NextBookingsList } from '@/features/dashboard/components/NextBookingsList';
import { TopServicesTable } from '@/features/dashboard/components/TopServicesTable';
import { BookingsOriginChart } from '@/features/dashboard/components/BookingsOriginChart';
import MonthlyRevenueChart from '@/features/dashboard/components/MonthlyRevenueChart';
import { WhatsAppCard } from '@/features/dashboard/components/WhatsAppCard';
import { TopServicesCard } from '@/features/dashboard/components/TopServicesCard';
import styles from './page.module.css';
import { useSession } from '@/providers/SessionProvider';
import dayjs from 'dayjs';

export default function PanelPage() {
    const { data, loading, fetchDashboard } = useDashboard();
    const user = useSession();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    if (loading) {
        return (
            <PageContainer
                title={`👋¡Hola, ${user?.firstName}!`}
                description="Resumen general de tu negocio"
            >
                <Row gutter={[16, 16]}>
                    {[1, 2, 3, 4].map((i) => (
                        <Col xs={24} sm={12} md={12} lg={6} key={i}>
                            <Card>
                                <Skeleton active paragraph={{ rows: 2 }} />
                            </Card>
                        </Col>
                    ))}
                </Row>
            </PageContainer>
        );
    }

    if (!data) {
        return (
            <PageContainer
                title={`👋¡Hola, ${user?.firstName}!`}
                description="Resumen general de tu negocio"
            >
                <Card>
                    <Empty description="No hay datos disponibles" />
                </Card>
            </PageContainer>
        );
    }

    return (
        <PageContainer
            title={`👋¡Hola, ${user?.firstName}!`}
            description="Veremos el resumen general de tu negocio"
            actions={
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 600, margin: 0 }}>{data.business.name}</p>
                    <p style={{ color: '#8c8c8c', fontSize: '14px', margin: 0 }}>Plan: {data.business.planName}</p>
                </div>
            }
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <StatCard
                        label='Citas Hoy'
                        value={data.agenda.today}
                        icon={<CalendarOutlined />}
                        iconBgColor="bg-blue-50"
                        iconColor="text-blue-600"
                    />
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <StatCard
                        label="Próximas Citas"
                        value={data.agenda.upcoming}
                        icon={<ClockCircleOutlined />}
                        iconBgColor="bg-orange-50"
                        iconColor="text-orange-600"
                    />
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <StatCard
                        label={`Ingresos del mes ${dayjs().format("MMM YY")}`}
                        value={`S/.${data.revenue.monthly}`}
                        icon={<DollarOutlined />}
                        iconBgColor="bg-green-50"
                        iconColor="text-green-600"
                    />
                </Col>
                <Col xs={24} sm={12} md={12} lg={6}>
                    <StatCard
                        label="Ingresos totales"
                        value={`S/.${data.revenue.total}`}
                        icon={<RiseOutlined />}
                        iconBgColor="bg-emerald-50"
                        iconColor="text-emerald-600"
                    />
                </Col>

                {/* Next Bookings List */}
                <Col xs={24} lg={12}>
                    <Card
                        title="Próximas Citas"
                        className={`${styles.nextBookingsCard} rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg`}
                        size='small'
                        styles={{ body: { padding: "8px" } }}
                        extra={
                            <Link href="/bookings">
                                <Button type="link" icon={<ArrowRightOutlined />} iconPlacement='end'>
                                    Ver todo
                                </Button>
                            </Link>
                        }
                    >
                        {data.nextBookings.length > 0 ? (
                            <NextBookingsList bookings={data.nextBookings} />
                        ) : (
                            <Empty description="No hay citas próximas" />
                        )}
                    </Card>
                </Col>

                {/* Right Column */}
                <Col xs={24} lg={12}>
                    <Row gutter={[16, 16]}>
                        {/* Monthly Revenue Chart */}
                        <Col xs={24}>
                            <Card
                                title="Ingresos Últimos 12 Meses"
                                className="rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg"
                                style={{ height: '300px' }}
                                size='small'
                            >
                                <div style={{ height: '220px' }}>
                                    {data.monthlyRevenue.length > 0 ? (
                                        <MonthlyRevenueChart data={data.monthlyRevenue} />
                                    ) : (
                                        <Empty description="No hay datos disponibles" />
                                    )}
                                </div>
                            </Card>
                        </Col>

                        {/* Bottom Row: WhatsApp and Top Services */}
                        <Col xs={24} md={12}>
                            <WhatsAppCard
                                used={data.whatsapp.used}
                                limit={data.whatsapp.limit}
                                remaining={data.whatsapp.remaining}
                                percentage={data.whatsapp.percentage}
                                periodStart={data.whatsapp.periodStart}
                                periodEnd={data.whatsapp.periodEnd}
                            />
                        </Col>

                        <Col xs={24} md={12}>
                            {data.topServices.length > 0 ? (
                                <TopServicesCard services={data.topServices} />
                            ) : (
                                <Card className="rounded-xl border border-gray-200">
                                    <Empty description="No hay datos disponibles" />
                                </Card>
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </PageContainer>
    );
}
