"use client";

import { useState, useEffect } from "react";
import { Modal, Form, Select, DatePicker, Button, Space, Alert, Tag, Empty } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import { useAvailability } from "../../hooks/useAvailability";
import { Professional } from "@/features/professionals/professional/types/professional.types";
import { Service } from "@/features/services-catalog/service/types/service.types";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "@/providers/SessionProvider";

interface CreateBookingModalProps {
    
}

export const CreateBookingModal = ({ }: CreateBookingModalProps) => {
    const [form] = Form.useForm();
    const { professionals, fetchProfessionals, loading: professionalsLoading } = useProfessionals();
    const { availability, loading: availabilityLoading, fetchAvailability, clearAvailability } = useAvailability();
    const [open, setOpen] = useState(false);

    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const userSession = useSession();

    // Fetch professionals on mount
    useEffect(() => {
        if (open) {
            fetchProfessionals({ is_active: true });
        }
    }, [open, fetchProfessionals]);

    // Update available services when professional changes
    useEffect(() => {
        if (selectedProfessional?.servicesModel) {
            const activeServices = selectedProfessional.servicesModel.filter(
                (service) => service.isActive
            );
            setAvailableServices(activeServices);
        } else {
            setAvailableServices([]);
        }
    }, [selectedProfessional]);

    // Fetch availability when all required fields are selected
    useEffect(() => {
        if (selectedProfessional?.id && selectedService?.id && selectedDate) {
            fetchAvailability({
                professional: selectedProfessional.id.toString(),
                service: selectedService.id.toString(),
                date: selectedDate.format("YYYY-MM-DD"),
            });
        } else {
            clearAvailability();
        }
    }, [selectedProfessional, selectedService, selectedDate, fetchAvailability, clearAvailability]);

    const onCancel = () => {
        setOpen(false);
    }

    const handleProfessionalChange = (professionalId: number) => {
        const professional = professionals.find((p) => p.id === professionalId) || null;
        setSelectedProfessional(professional);
        setSelectedService(null);
        form.setFieldValue("service", undefined);
    };

    const handleServiceChange = (serviceId: number) => {
        const service = availableServices.find((s) => s.id === serviceId) || null;
        setSelectedService(service);
    };

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
        setSelectedTime(null);
        form.setFieldValue("time", undefined);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        form.setFieldValue("time", time);
    };

    // Agrupar horarios por turno
    const groupTimesByPeriod = (times: string[]) => {
        const morning: string[] = [];
        const afternoon: string[] = [];
        const night: string[] = [];

        times.forEach((time) => {
            const hour = parseInt(time.split(":")[0]);
            if (hour >= 0 && hour < 12) {
                morning.push(time);
            } else if (hour >= 12 && hour < 19) {
                afternoon.push(time);
            } else {
                night.push(time);
            }
        });

        return { morning, afternoon, night };
    };

    const handleFinish = (values: any) => {
        console.log("=== DATOS SELECCIONADOS ===");
        console.log("Professional:", selectedProfessional);
        console.log("Service:", selectedService);
        console.log("Date:", selectedDate?.format("YYYY-MM-DD"));
        console.log("Time:", selectedTime);
        console.log("Availability:", availability);
        console.log("Form Values:", values);
        console.log("========================");
        console.log("userSession", userSession);
    };

    const handleClose = () => {
        form.resetFields();
        setSelectedProfessional(null);
        setSelectedService(null);
        setSelectedDate(dayjs());
        setSelectedTime(null);
        clearAvailability();
        onCancel();
    };

    return (
        <>
            <Button
                type="primary"
                icon={<CalendarOutlined />}
                onClick={() => setOpen(true)}
            >
                Nueva Cita
            </Button>
            <Modal
                title="Nueva Cita"
                open={open}
                onCancel={handleClose}
                footer={null}
                width="48rem"
                destroyOnHidden
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    style={{ marginTop: 24 }}
                >
                    {/* Profesional */}
                    <Form.Item
                        label="Profesional"
                        name="professional"
                        rules={[{ required: true, message: "Selecciona un profesional" }]}
                    >
                        <Select
                            placeholder="Selecciona un profesional"
                            loading={professionalsLoading}
                            onChange={handleProfessionalChange}
                            size="large"
                        >
                            {professionals.map((prof) => (
                                <Select.Option key={prof.id} value={prof.id!}>
                                    {prof.name} {prof.lastName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Servicio */}
                    <Form.Item
                        label="Servicio"
                        name="service"
                        rules={[{ required: true, message: "Selecciona un servicio" }]}
                    >
                        <Select
                            placeholder="Selecciona un servicio"
                            disabled={!selectedProfessional}
                            onChange={handleServiceChange}
                            size="large"
                        >
                            {availableServices.map((service) => (
                                <Select.Option key={service.id} value={service.id!}>
                                    {service.name}
                                    {service.price && (
                                        <span style={{ marginLeft: 8, color: "#8c8c8c" }}>
                                            - S/. {service.price}
                                        </span>
                                    )}
                                    {service.durationMinutes && (
                                        <span style={{ marginLeft: 8, color: "#8c8c8c" }}>
                                            - {service.durationMinutes} min
                                        </span>
                                    )}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Fecha */}
                    <Form.Item
                        label="Fecha"
                        name="date"
                        rules={[{ required: true, message: "Selecciona una fecha" }]}
                        initialValue={dayjs()}
                    >
                        <DatePicker
                            placeholder="Selecciona una fecha"
                            disabled={!selectedService}
                            onChange={handleDateChange}
                            format="DD/MM/YYYY"
                            style={{ width: "100%" }}
                            size="large"
                        />
                    </Form.Item>

                    {/* Disponibilidad */}
                    {availabilityLoading && (
                        <Alert
                            message="Consultando disponibilidad..."
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                    )}

                    {!availabilityLoading && availability && availability.availableTimes.length > 0 && (
                        <Form.Item
                            label={`Horario disponible (${availability.availableTimes.length} opciones)`}
                            name="time"
                            rules={[{ required: true, message: "Selecciona un horario" }]}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {(() => {
                                    const { morning, afternoon, night } = groupTimesByPeriod(availability.availableTimes);
                                    return (
                                        <>
                                            {morning.length > 0 && (
                                                <div>
                                                    <div style={{ marginBottom: 8, fontSize: 13, color: "#8c8c8c", fontWeight: 500 }}>
                                                        Mañana
                                                    </div>
                                                    <Space wrap size={[8, 8]}>
                                                        {morning.map((time) => (
                                                            <Tag
                                                                key={time}
                                                                style={{
                                                                    fontSize: 14,
                                                                    padding: "6px 16px",
                                                                    cursor: "pointer",
                                                                    border: "2px solid",
                                                                    borderColor: selectedTime === time ? "#1890ff" : "#d9d9d9",
                                                                    backgroundColor: selectedTime === time ? "#e6f7ff" : "#fafafa",
                                                                    color: selectedTime === time ? "#1890ff" : "#595959",
                                                                    transition: "all 0.2s",
                                                                }}
                                                                onClick={() => handleTimeSelect(time)}
                                                            >
                                                                {time}
                                                            </Tag>
                                                        ))}
                                                    </Space>
                                                </div>
                                            )}
                                            {afternoon.length > 0 && (
                                                <div>
                                                    <div style={{ marginBottom: 8, fontSize: 13, color: "#8c8c8c", fontWeight: 500 }}>
                                                        Tarde
                                                    </div>
                                                    <Space wrap size={[8, 8]}>
                                                        {afternoon.map((time) => (
                                                            <Tag
                                                                key={time}
                                                                style={{
                                                                    fontSize: 14,
                                                                    padding: "6px 16px",
                                                                    cursor: "pointer",
                                                                    border: "2px solid",
                                                                    borderColor: selectedTime === time ? "#1890ff" : "#d9d9d9",
                                                                    backgroundColor: selectedTime === time ? "#e6f7ff" : "#fafafa",
                                                                    color: selectedTime === time ? "#1890ff" : "#595959",
                                                                    transition: "all 0.2s",
                                                                }}
                                                                onClick={() => handleTimeSelect(time)}
                                                            >
                                                                {time}
                                                            </Tag>
                                                        ))}
                                                    </Space>
                                                </div>
                                            )}
                                            {night.length > 0 && (
                                                <div>
                                                    <div style={{ marginBottom: 8, fontSize: 13, color: "#8c8c8c", fontWeight: 500 }}>
                                                        Noche
                                                    </div>
                                                    <Space wrap size={[8, 8]}>
                                                        {night.map((time) => (
                                                            <Tag
                                                                key={time}
                                                                style={{
                                                                    fontSize: 14,
                                                                    padding: "6px 16px",
                                                                    cursor: "pointer",
                                                                    border: "2px solid",
                                                                    borderColor: selectedTime === time ? "#1890ff" : "#d9d9d9",
                                                                    backgroundColor: selectedTime === time ? "#e6f7ff" : "#fafafa",
                                                                    color: selectedTime === time ? "#1890ff" : "#595959",
                                                                    transition: "all 0.2s",
                                                                }}
                                                                onClick={() => handleTimeSelect(time)}
                                                            >
                                                                {time}
                                                            </Tag>
                                                        ))}
                                                    </Space>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </Form.Item>
                    )}

                    {!availabilityLoading && availability && availability.availableTimes.length === 0 && (
                        <Empty
                            description="No hay horarios disponibles para esta fecha"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            style={{ marginBottom: 16 }}
                        />
                    )}

                    {/* Botones */}
                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                            <Button onClick={handleClose} size="large">
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<CalendarOutlined />}
                                size="large"
                            >
                                Ver Datos (Console)
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
