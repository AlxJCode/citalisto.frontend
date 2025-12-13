"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Button, Descriptions, Result, Space, Modal, Input, message, Tag, Divider } from "antd";
import {
    CloseCircleOutlined,
    LoadingOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined,
    HomeOutlined,
    EnvironmentOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { publicBookingService } from "../../services/publicBookingService";
import { PublicBooking } from "../../types/publicBooking.types";

const { TextArea } = Input;

// Helper para parsear fechas sin problemas de timezone
const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

interface PublicBookingViewProps {
    publicToken: string;
}

export const PublicBookingView = ({ publicToken }: PublicBookingViewProps) => {
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<PublicBooking | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");

    const fetchBooking = useCallback(async () => {
        setLoading(true);
        const result = await publicBookingService.getBooking(publicToken);

        if (result.success && result.data) {
            setBooking(result.data);
            setError(null);
        } else {
            setError(result.message || "No se pudo cargar la cita");
        }

        setLoading(false);
    }, [publicToken]);

    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    const handleCancelBooking = async () => {
        setCancelling(true);
        const result = await publicBookingService.cancelBooking(
            publicToken,
            cancellationReason || undefined
        );

        if (result.success) {
            message.success("Cita cancelada exitosamente");
            fetchBooking();
            setCancelModalOpen(false);
        } else {
            message.error(result.message || "No se pudo cancelar la cita");
        }

        setCancelling(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <Space orientation="vertical" align="center" size="large">
                    <LoadingOutlined style={{ fontSize: 56, color: "#1890ff" }} spin />
                    <p className="text-lg text-gray-600">Cargando información de la cita...</p>
                </Space>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="flex items-center justify-center min-h-screen middle-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="max-w-md">
                    <Result
                        status="404"
                        title="Cita no encontrada"
                        subTitle={error || "El enlace no es válido o la cita no existe"}
                    />
                </div>
            </div>
        );
    }

    const isCancellable = booking.status === "confirmed" || booking.status === "pending";
    const isCancelled = booking.status === "cancelled";

    const getStatusTag = () => {
        switch (booking.status) {
            case "confirmed":
                return <Tag color="success" icon={<CheckCircleOutlined />}>Confirmada</Tag>;
            case "pending":
                return <Tag color="warning" icon={<ClockCircleOutlined />}>Pendiente</Tag>;
            case "cancelled":
                return <Tag color="error" icon={<CloseCircleOutlined />}>Cancelada</Tag>;
            case "completed":
                return <Tag color="blue" icon={<CheckCircleOutlined />}>Completada</Tag>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center middle-8">
            <div className="max-w-2xl w-full py-8">
                <Card
                    className="shadow-xl rounded-2xl"
                    bordered={false}
                    style={{ borderRadius: "16px" }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{booking.business_name}</h1>
                        <p className="text-gray-500 text-lg">Detalles de tu cita</p>
                        <div className="mt-4 flex justify-center">{getStatusTag()}</div>
                    </div>

                    <Divider />

                    {/* Detalles principales */}
                    <div className="space-y-5 mb-6 flex flex-col gap-4">
                        <div className="flex items-start gap-4 middle-8 bg-blue-50 rounded-lg">
                            <CalendarOutlined className="text-2xl text-blue-600 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">Fecha</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {parseLocalDate(booking.date).toLocaleDateString("es-PE", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 middle-8 bg-purple-50 rounded-lg">
                            <ClockCircleOutlined className="text-2xl text-purple-600 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">Horario</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 middle-8 bg-green-50 rounded-lg">
                            <UserOutlined className="text-2xl text-green-600 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">Profesional</p>
                                <p className="text-lg font-semibold text-gray-800">{booking.professional_name}</p>
                                <p className="text-sm text-gray-600 mt-1">{booking.service_name}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 middle-8 bg-orange-50 rounded-lg">
                            <HomeOutlined className="text-2xl text-orange-600 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">Sucursal</p>
                                <p className="text-lg font-semibold text-gray-800">{booking.branch_name}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 middle-8 bg-red-50 rounded-lg">
                            <EnvironmentOutlined className="text-2xl text-red-600 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">Dirección</p>
                                <p className="text-base text-gray-800">{booking.branch_address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información de cancelación */}
                    {isCancelled && booking.cancelled_at && (
                        <div className="mt-6 middle-8 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-500">Cancelada el</p>
                            <p className="text-base font-medium text-gray-800">
                                {parseLocalDate(booking.cancelled_at).toLocaleDateString("es-PE")}
                            </p>
                            {booking.cancellation_reason && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500">Motivo</p>
                                    <p className="text-base text-gray-700">{booking.cancellation_reason}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <Divider />

                    {/* Acciones y estados */}
                    {isCancellable && (
                        <div className="text-center">
                            <Button
                                type="primary"
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => setCancelModalOpen(true)}
                                size="large"
                                className="px-8 py-6 h-auto text-base font-medium rounded-lg"
                            >
                                Cancelar Cita
                            </Button>
                        </div>
                    )}

                    {isCancelled && (
                        <Result
                            status="info"
                            icon={<CloseCircleOutlined style={{ color: "#faad14" }} />}
                            title={<span className="text-xl">Esta cita ha sido cancelada</span>}
                            subTitle="Si necesitas reprogramar, contacta directamente con el negocio."
                        />
                    )}

                    {booking.status === "completed" && (
                        <Result
                            status="success"
                            icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                            title={<span className="text-xl">Esta cita ya fue completada</span>}
                            subTitle="Gracias por tu visita. No es posible cancelar citas pasadas."
                        />
                    )}
                </Card>

                <Modal
                    title={
                        <div className="text-center">
                            <CloseCircleOutlined className="text-4xl text-orange-500 mb-2" />
                            <p className="text-xl font-semibold">¿Confirmas cancelar tu cita?</p>
                        </div>
                    }
                    open={cancelModalOpen}
                    onCancel={() => setCancelModalOpen(false)}
                    centered
                    width={520}
                    footer={
                        <div className="flex gap-3 justify-end pt-4">
                            <Button
                                size="large"
                                onClick={() => setCancelModalOpen(false)}
                                disabled={cancelling}
                                className="px-6"
                            >
                                No, mantener cita
                            </Button>
                            <Button
                                size="large"
                                type="primary"
                                danger
                                loading={cancelling}
                                onClick={handleCancelBooking}
                                className="px-6"
                            >
                                Sí, cancelar cita
                            </Button>
                        </div>
                    }
                >
                    <div className="py-4">
                        <div className="mb-6 middle-8 bg-orange-50 rounded-lg border border-orange-200">
                            <p className="text-sm text-orange-800">
                                ⚠️ <strong>Atención:</strong> Esta acción no se puede deshacer.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Motivo de cancelación (opcional)
                            </label>
                            <TextArea
                                placeholder="Ej: Tengo un imprevisto, necesito reprogramar..."
                                rows={4}
                                value={cancellationReason}
                                onChange={(e) => setCancellationReason(e.target.value)}
                                maxLength={500}
                                showCount
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
