"use client";

import { FC } from "react";
import { Row, Col, Divider, Typography } from "antd";
import {
    CalendarOutlined,
    MessageOutlined,
    CheckCircleOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";

import { PageContainer } from "@/components/layout/PageContainer";
import MetricCard from "@/components/dashboard/MetricCard";
import MetricCardWithProgress from "@/components/dashboard/MetricCardWithProgress";
import MetricCardWithTrend from "@/components/dashboard/MetricCardWithTrend";
import MetricCardWithRing from "@/components/dashboard/MetricCardWithRing";

const { Title, Paragraph } = Typography;

const DashboardDemoPage: FC = () => {
    return (
        <PageContainer
            title="Demo de Cards de Estadísticas"
            description="Compara las diferentes variantes de cards para elegir tu favorita"
        >
            <div style={{ marginBottom: "32px" }}>
                <Title level={4}>Variante Original - Card Simple</Title>
                <Paragraph type="secondary">
                    Card básico con icono, valor, label y subtitle opcional
                </Paragraph>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCard
                            icon={<CalendarOutlined />}
                            iconBgColor="#e6f4ff"
                            iconColor="#1890ff"
                            value={5}
                            label="Citas de Hoy"
                            subtitle="Próxima: 10:30 AM"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCard
                            icon={<DollarOutlined />}
                            iconBgColor="#f6ffed"
                            iconColor="#52c41a"
                            value="$45,500"
                            label="Ingresos del Mes"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCard
                            icon={<CloseCircleOutlined />}
                            iconBgColor="#fff1f0"
                            iconColor="#ff4d4f"
                            value={12}
                            label="Cancelaciones"
                            subtitle="8% del total"
                        />
                    </Col>
                </Row>
            </div>

            <Divider />

            <div style={{ marginBottom: "32px" }}>
                <Title level={4}>Variante 1 - Card con Progress Bar</Title>
                <Paragraph type="secondary">
                    Ideal para mostrar progreso hacia un objetivo o límite (ej: uso de recursos)
                </Paragraph>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithProgress
                            icon={<MessageOutlined />}
                            iconBgColor="#f6ffed"
                            iconColor="#52c41a"
                            value="350 restantes"
                            label="Mensajes WhatsApp"
                            subtitle="650 de 1000 usados"
                            progress={{
                                percent: 65,
                                strokeColor: "#52c41a",
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithProgress
                            icon={<MessageOutlined />}
                            iconBgColor="#fffbe6"
                            iconColor="#faad14"
                            value="200 restantes"
                            label="Mensajes WhatsApp"
                            subtitle="800 de 1000 usados"
                            progress={{
                                percent: 80,
                                strokeColor: "#faad14",
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithProgress
                            icon={<MessageOutlined />}
                            iconBgColor="#fff1f0"
                            iconColor="#ff4d4f"
                            value="50 restantes"
                            label="Mensajes WhatsApp"
                            subtitle="950 de 1000 usados"
                            progress={{
                                percent: 95,
                                strokeColor: "#ff4d4f",
                                status: "exception",
                            }}
                        />
                    </Col>
                </Row>
            </div>

            <Divider />

            <div style={{ marginBottom: "32px" }}>
                <Title level={4}>Variante 2 - Card con Tendencia</Title>
                <Paragraph type="secondary">
                    Muestra crecimiento o decrecimiento comparado con período anterior
                </Paragraph>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithTrend
                            icon={<CalendarOutlined />}
                            iconBgColor="#e6f4ff"
                            iconColor="#1890ff"
                            value={5}
                            label="Citas de Hoy"
                            subtitle="Próxima: 10:30 AM"
                            trend={{
                                value: 12,
                                direction: "up",
                                label: "vs mes anterior",
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithTrend
                            icon={<DollarOutlined />}
                            iconBgColor="#f6ffed"
                            iconColor="#52c41a"
                            value="$45,500"
                            label="Ingresos del Mes"
                            trend={{
                                value: 18,
                                direction: "up",
                                label: "vs mes pasado",
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithTrend
                            icon={<CloseCircleOutlined />}
                            iconBgColor="#fff1f0"
                            iconColor="#ff4d4f"
                            value={12}
                            label="Cancelaciones"
                            subtitle="8% del total"
                            trend={{
                                value: 5,
                                direction: "down",
                                label: "vs mes anterior",
                            }}
                        />
                    </Col>
                </Row>
            </div>

            <Divider />

            <div style={{ marginBottom: "32px" }}>
                <Title level={4}>Variante 3 - Card con Progress Ring</Title>
                <Paragraph type="secondary">
                    Perfecto para porcentajes y métricas visuales. Más compacto verticalmente
                </Paragraph>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithRing
                            icon={<CheckCircleOutlined />}
                            value="87%"
                            label="Tasa de Asistencia"
                            subtitle="87 de 100 pacientes"
                            progress={{
                                percent: 87,
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithRing
                            icon={<MessageOutlined />}
                            value="65%"
                            label="Uso de WhatsApp"
                            subtitle="650 de 1000 mensajes"
                            progress={{
                                percent: 65,
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithRing
                            icon={<ClockCircleOutlined />}
                            value="45%"
                            label="Confirmación de Citas"
                            subtitle="Solo 45% confirmadas"
                            progress={{
                                percent: 45,
                            }}
                        />
                    </Col>
                </Row>
            </div>

            <Divider />

            <div style={{ marginBottom: "32px" }}>
                <Title level={4}>Mix Recomendado - Combinando Variantes</Title>
                <Paragraph type="secondary">
                    Usa diferentes cards según el tipo de métrica para un dashboard más rico
                </Paragraph>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithTrend
                            icon={<CalendarOutlined />}
                            iconBgColor="#e6f4ff"
                            iconColor="#1890ff"
                            value={5}
                            label="Citas de Hoy"
                            subtitle="Próxima: 10:30 AM"
                            trend={{
                                value: 12,
                                direction: "up",
                                label: "vs mes anterior",
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithProgress
                            icon={<MessageOutlined />}
                            iconBgColor="#fffbe6"
                            iconColor="#faad14"
                            value="200 restantes"
                            label="Mensajes WhatsApp"
                            subtitle="80% usado"
                            progress={{
                                percent: 80,
                                strokeColor: "#faad14",
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <MetricCardWithRing
                            icon={<CheckCircleOutlined />}
                            value="87%"
                            label="Tasa de Asistencia"
                            subtitle="87 de 100 pacientes"
                            progress={{
                                percent: 87,
                            }}
                        />
                    </Col>
                </Row>
            </div>
        </PageContainer>
    );
};

export default DashboardDemoPage;
