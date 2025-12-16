"use client";

import { useState } from "react";
import { Button, Modal, Collapse, Space, Typography, Tag, Timeline } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export const AvailabilityGuide = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                type="default"
                icon={<QuestionCircleOutlined />}
                onClick={() => setOpen(true)}
            >
                Guía de Ayuda
            </Button>

            <Modal
                title="Guía de Configuración de Disponibilidad"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={700}
                centered
            >
                <Space orientation="vertical" style={{ width: "100%" }} size="large">
                <Collapse
                    
                    style={{ background: "transparent" }}
                    items={[
                        {
                            key: "1",
                            label: (
                                <Space>
                                    <CalendarOutlined />
                                    <Text strong>Horario Semanal</Text>
                                </Space>
                            ),
                            children: (
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <Paragraph>
                                        Define los días y horarios habituales en los que el profesional está
                                        disponible para atender. Este horario se repite cada semana.
                                    </Paragraph>

                                    <Text strong>Cómo configurar:</Text>
                                    <Space orientation="vertical" size="small" style={{ paddingLeft: 16 }}>
                                        <Text>
                                            1. <ClockCircleOutlined /> Activa el día con el switch
                                        </Text>
                                        <Text>2. Define el horario de inicio y fin</Text>
                                        <Text>3. (Opcional) Agrega un horario de descanso</Text>
                                        <Text>4. Haz clic en "Guardar"</Text>
                                    </Space>

                                    <Text strong>Ejemplo:</Text>
                                    <div
                                        style={{
                                            background: "#f5f5f5",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            marginTop: 8,
                                        }}
                                    >
                                        <Space orientation="vertical" size="small">
                                            <Space>
                                                <Tag color="blue">Lunes</Tag>
                                                <Text>09:00 - 18:00</Text>
                                                <Text type="secondary">(Descanso: 13:00 - 14:00)</Text>
                                            </Space>
                                            <Space>
                                                <Tag color="blue">Martes</Tag>
                                                <Text>09:00 - 18:00</Text>
                                            </Space>
                                            <Space>
                                                <Tag color="default">Domingo</Tag>
                                                <Text type="secondary">No disponible</Text>
                                            </Space>
                                        </Space>
                                    </div>
                                </Space>
                            ),
                        },
                        {
                            key: "2",
                            label: (
                                <Space>
                                    <InfoCircleOutlined />
                                    <Text strong>Excepciones de Disponibilidad</Text>
                                </Space>
                            ),
                            children: (
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <Paragraph>
                                        Las excepciones permiten modificar la disponibilidad para días específicos,
                                        sobrescribiendo el horario semanal.
                                    </Paragraph>

                                    <Text strong>Tipos de excepciones:</Text>

                                    <Timeline
                                        style={{ marginTop: 12 }}
                                        items={[
                                            {
                                                color: "red",
                                                dot: <CloseCircleOutlined />,
                                                children: (
                                                    <Space orientation="vertical" size="small">
                                                        <Text strong>Bloquear Día</Text>
                                                        <Text type="secondary">
                                                            El profesional NO estará disponible ese día
                                                        </Text>
                                                        <Text type="secondary">
                                                            💡 Ejemplo: Vacaciones, día festivo, enfermedad
                                                        </Text>
                                                    </Space>
                                                ),
                                            },
                                            {
                                                color: "green",
                                                dot: <CheckCircleOutlined />,
                                                children: (
                                                    <Space orientation="vertical" size="small">
                                                        <Text strong>Horario Personalizado</Text>
                                                        <Text type="secondary">
                                                            Define un horario diferente para ese día específico
                                                        </Text>
                                                        <Text type="secondary">
                                                            💡 Ejemplo: Viernes 15/12 trabajará de 10:00 a 14:00
                                                        </Text>
                                                    </Space>
                                                ),
                                            },
                                        ]}
                                    />

                                    <div
                                        style={{
                                            background: "#e6f7ff",
                                            border: "1px solid #91d5ff",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            marginTop: 12,
                                        }}
                                    >
                                        <Space orientation="vertical" size="small">
                                            <Text strong>📌 Nota importante:</Text>
                                            <Text>
                                                Las excepciones tienen prioridad sobre el horario semanal. Si hay
                                                una excepción para un día, se usará esa configuración en lugar del
                                                horario semanal.
                                            </Text>
                                        </Space>
                                    </div>
                                </Space>
                            ),
                        },
                    ]}
                />
                </Space>
            </Modal>
        </>
    );
};
