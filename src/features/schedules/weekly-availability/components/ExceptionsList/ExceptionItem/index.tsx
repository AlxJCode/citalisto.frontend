"use client";

import { Card, Space, Tag, Typography, Button, Popconfirm } from "antd";
import { ClockCircleOutlined, CalendarOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ProfessionalAvailabilityException } from "@/features/schedules/availability-exception/types/professional-availability-exception.types";

const { Text } = Typography;

interface ExceptionItemProps {
    exception: ProfessionalAvailabilityException;
    loading: boolean;
    onDelete: (id: number) => void;
}

export const ExceptionItem = ({ exception, loading, onDelete }: ExceptionItemProps) => {
    const isAvailable = exception.status === "available";
    const hasTimeRange = isAvailable && exception.startTime && exception.endTime;
    const hasBreak = exception.breakStartTime && exception.breakEndTime;

    // Verificar si la fecha ya pasó
    const isPast = dayjs(exception.date).isBefore(dayjs().startOf("day"));

    return (
        <Card
            size="small"
            style={{
                borderLeft: `4px solid ${isAvailable ? "#52c41a" : "#ff4d4f"}`,
                opacity: isPast ? 0.5 : 1,
                filter: isPast ? "grayscale(20%)" : "none",
            }}
        >
            <Space orientation="vertical" style={{ width: "100%" }} size="small">
                {/* Fila: Fecha y Botón Eliminar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Space>
                        <CalendarOutlined />
                        <Text strong>{dayjs(exception.date).format("DD/MM/YYYY - dddd")}</Text>
                        <Tag color={isAvailable ? "success" : "error"}>
                            {isAvailable ? "Disponible" : "Bloqueado"}
                        </Tag>
                    </Space>

                    <Popconfirm
                        title="¿Eliminar excepción?"
                        description="Esta acción no se puede deshacer"
                        onConfirm={() => onDelete(exception.id!)}
                        okText="Eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            loading={loading}
                        />
                    </Popconfirm>
                </div>

                {/* Horarios */}
                {hasTimeRange && (
                    <Space>
                        <ClockCircleOutlined />
                        <Text type="secondary">
                            {dayjs(exception.startTime, "HH:mm:ss").format("HH:mm")} -{" "}
                            {dayjs(exception.endTime, "HH:mm:ss").format("HH:mm")}
                        </Text>
                        {hasBreak && (
                            <Text type="secondary">
                                (Descanso: {dayjs(exception.breakStartTime, "HH:mm:ss").format("HH:mm")} -{" "}
                                {dayjs(exception.breakEndTime, "HH:mm:ss").format("HH:mm")})
                            </Text>
                        )}
                    </Space>
                )}

                {/* Notas */}
                {exception.notes && (
                    <Text type="secondary" italic>
                        {exception.notes}
                    </Text>
                )}
            </Space>
        </Card>
    );
};
