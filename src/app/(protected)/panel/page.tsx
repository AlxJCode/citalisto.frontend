"use client";

import { useEffect } from 'react';
import { Row, Col, Card, Skeleton, Empty } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { PageContainer } from '@/components/layout/PageContainer';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { RevenueCard } from '@/features/dashboard/components/RevenueCard';
import { WhatsAppUsageCard } from '@/features/dashboard/components/WhatsAppUsageCard';
import { AttendanceCard } from '@/features/dashboard/components/AttendanceCard';
import { NextBookingsList } from '@/features/dashboard/components/NextBookingsList';
import { TopServicesTable } from '@/features/dashboard/components/TopServicesTable';
import { BookingsOriginChart } from '@/features/dashboard/components/BookingsOriginChart';
import styles from './page.module.css';

export default function PanelPage() {
    const { data, loading, fetchDashboard } = useDashboard();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    if (loading) {
        return (
            <PageContainer
                title="Panel de Control"
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
                title="Panel de Control"
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
            title="Panel de Control"
            description="Resumen general de tu negocio"
            actions={
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 600, margin: 0 }}>{data.business.name}</p>
                    <p style={{ color: '#8c8c8c', fontSize: '14px', margin: 0 }}>Plan: {data.business.planName}</p>
                </div>
            }
        >
            <Row gutter={[16, 16]}>
                {/* Stats Cards Row - 5 cards responsive */}
                <Col xs={24} sm={12} lg={8} xl={4} xxl={4} className={styles.dashboardCol}>
                    <StatCard
                        title="Citas Hoy"
                        value={data.agenda.today}
                        icon={<CalendarOutlined />}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8} xl={4} xxl={4} className={styles.dashboardCol}>
                    <StatCard
                        title="Próximas Citas"
                        value={data.agenda.upcoming}
                        icon={<ClockCircleOutlined />}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8} xl={5} xxl={5} className={styles.dashboardCol}>
                    <RevenueCard
                        monthly={data.revenue.monthly}
                        total={data.revenue.total}
                    />
                </Col>
                <Col xs={24} sm={12} lg={12} xl={6} xxl={6} className={styles.dashboardCol}>
                    <WhatsAppUsageCard
                        used={data.whatsapp.used}
                        limit={data.whatsapp.limit}
                        remaining={data.whatsapp.remaining}
                        percentage={data.whatsapp.percentage}
                    />
                </Col>
                <Col xs={24} sm={24} lg={12} xl={5} xxl={5} className={styles.dashboardCol}>
                    <AttendanceCard
                        rate={data.attendance.rate}
                        completed={data.attendance.completed}
                        cancelled={data.attendance.cancelled}
                    />
                </Col>

                {/* Next Bookings List */}
                <Col xs={24} lg={14} className={styles.dashboardCol}>
                    <Card title="Próximas Citas" className={styles.dashboardCard} style={{ maxHeight: '300px' }}>
                        {data.nextBookings.length > 0 ? (
                            <NextBookingsList bookings={data.nextBookings} />
                        ) : (
                            <Empty description="No hay citas próximas" />
                        )}
                    </Card>
                </Col>

                {/* Bookings Origin Chart */}
                <Col xs={24} lg={10} className={styles.dashboardCol}>
                    <Card title="Origen de Reservas" className={styles.dashboardCard} style={{ maxHeight: '300px' }}>
                        <BookingsOriginChart
                            widget={data.bookingsOrigin.widget}
                            manual={data.bookingsOrigin.manual}
                            widgetPercentage={data.bookingsOrigin.widgetPercentage}
                        />
                    </Card>
                </Col>

                {/* Top Services Table */}
                <Col xs={24} md={12} className={styles.dashboardCol}>
                    <Card title="5 Servicios Más Solicitados" className={styles.dashboardCard}>
                        {data.topServices.length > 0 ? (
                            <TopServicesTable services={data.topServices} />
                        ) : (
                            <Empty description="No hay datos disponibles" />
                        )}
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    );
}
