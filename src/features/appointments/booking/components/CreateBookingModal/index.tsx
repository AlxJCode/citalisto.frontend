"use client";

import { useState, useEffect } from "react";
import { Modal, Form, Select, DatePicker, Button, Space, Alert, Tag, Empty, Switch, Row, Col } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import { useBranches } from "@/features/organizations/branch/hooks/useBranches";
import { useCustomers } from "@/features/customers/customer/hooks/useCustomers";
import { useBookings } from "../../hooks/useBookings";
import { useAvailability } from "../../hooks/useAvailability";
import { AddCustomerModal } from "@/features/customers/customer/components/AddCustomerModal";
import { Professional } from "@/features/professionals/professional/types/professional.types";
import { Service } from "@/features/services-catalog/service/types/service.types";
import { BookingApi } from "../../types/booking.types";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "@/providers/SessionProvider";
import { setBackendErrors } from "@/lib/utils/form";

interface BookingFormValues {
    branch: number;
    customer: number;
    professional: number;
    service: number;
    date: Dayjs;
    time: string;
    notifyByWhatsapp?: boolean;
    notifyByEmail?: boolean;
}

interface CreateBookingModalProps {
    onSuccess?: () => void;
}

export const CreateBookingModal = ({ onSuccess }: CreateBookingModalProps) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);

    const { branches, fetchBranches, loading: branchesLoading } = useBranches();
    const { customers, fetchCustomers, loading: customersLoading } = useCustomers();
    const { professionals, fetchProfessionals, loading: professionalsLoading } = useProfessionals();
    const { availability, loading: availabilityLoading, fetchAvailability, clearAvailability } = useAvailability();
    const { createBooking } = useBookings();
    const userSession = useSession();

    // Fetch branches and customers on mount
    useEffect(() => {
        if (open) {
            fetchBranches({ is_active: true });
            fetchCustomers({ is_active: true });
        }
    }, [open, fetchBranches, fetchCustomers]);

    // Fetch professionals when branch is selected
    useEffect(() => {
        if (open && selectedBranch) {
            fetchProfessionals({ is_active: true, branch: selectedBranch });
        }
    }, [open, selectedBranch, fetchProfessionals]);

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

    const handleBranchChange = (branchId: number) => {
        setSelectedBranch(branchId);
        // Reset cascada
        setSelectedProfessional(null);
        setSelectedService(null);
        form.setFieldsValue({ professional: undefined, service: undefined });
    };

    const handleNewCustomer = (newCustomer?: any) => {
        if (newCustomer) {
            fetchCustomers({ is_active: true });
            setSelectedCustomer(newCustomer.id!);
            form.setFieldValue("customer", newCustomer.id!);
        }
    };

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

    const handleFinish = async (values: BookingFormValues) => {
        if (!selectedService || !userSession?.business) {
            return;
        }
        setLoading(true);

        // Calcular end_time basado en duración del servicio
        const startTime = values.time; // "10:00"
        const endTime = dayjs(values.time, "HH:mm")
            .add(selectedService.durationMinutes, "minute")
            .format("HH:mm");

        const bookingData: Partial<BookingApi> = {
            business: userSession.business,
            branch: values.branch,
            professional: values.professional,
            service: values.service,
            customer: values.customer,
            date: values.date.format("YYYY-MM-DD"),
            start_time: `${startTime}:00`, // "10:00:00"
            end_time: `${endTime}:00`,     // "11:00:00"
            price: selectedService.price ? parseInt(selectedService.price): undefined,
            status: "confirmed",
            notes: null,
            notify_by_whatsapp: values.notifyByWhatsapp ?? false,
            notify_by_email: values.notifyByEmail ?? false,
            auto_confirmed: false,
            source: "business",
        };

        const result = await createBooking(bookingData);
        setLoading(false);

        if (result.success) {
            handleClose();
            onSuccess?.();
        } else if (result.errorFields) {
            setBackendErrors(form, result.errorFields);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setSelectedBranch(null);
        setSelectedCustomer(null);
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
                    {/* Sucursal */}
                    <Form.Item
                        label="Sucursal"
                        name="branch"
                        rules={[{ required: true, message: "Selecciona una sucursal" }]}
                    >
                        <Select
                            placeholder="Selecciona una sucursal"
                            loading={branchesLoading}
                            onChange={handleBranchChange}
                            size="middle"
                        >
                            {branches.map((branch) => (
                                <Select.Option key={branch.id} value={branch.id!}>
                                    {branch.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Cliente */}
                    <Form.Item
                        label="Cliente"
                        name="customer"
                        rules={[{ required: true, message: "Selecciona un cliente" }]}
                    >
                        <Space.Compact style={{ width: "100%" }}>
                            <Select
                                placeholder="Selecciona un cliente"
                                loading={customersLoading}
                                onChange={(value) => {
                                    setSelectedCustomer(value);
                                    form.setFieldValue("customer", value);
                                }}
                                showSearch={{optionFilterProp: "children"}}
                                style={{ width: "100%" }}
                                size="middle"
                            >
                                {customers.map((customer) => (
                                    <Select.Option key={customer.id} value={customer.id!}>
                                        {`${customer.name} ${customer.lastName} - ${customer.phone}`}
                                    </Select.Option>
                                ))}
                            </Select>
                            <AddCustomerModal onSuccess={handleNewCustomer} />
                        </Space.Compact>
                    </Form.Item>

                    {/* Profesional */}
                    <Form.Item
                        label="Profesional"
                        name="professional"
                        rules={[{ required: true, message: "Selecciona un profesional" }]}
                    >
                        <Select
                            placeholder="Selecciona un profesional"
                            disabled={!selectedBranch}
                            loading={professionalsLoading}
                            onChange={handleProfessionalChange}
                            size="middle"
                        >
                            {professionals.map((prof) => (
                                <Select.Option key={prof.id} value={prof.id!}>
                                    {`${prof.name} ${prof.lastName}`}
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
                            size="middle"
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
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                            style={{ width: "100%" }}
                            size="middle"
                        />
                    </Form.Item>

                    {/* Disponibilidad */}
                    {availabilityLoading && (
                        <Alert
                            title="Consultando disponibilidad..."
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

                    {/* Notificaciones */}
                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Notificar por WhatsApp"
                                name="notifyByWhatsapp"
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Switch checkedChildren="Sí" unCheckedChildren="No" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Notificar por Email"
                                name="notifyByEmail"
                                valuePropName="checked"
                                initialValue={true}
                            >
                                <Switch checkedChildren="Sí" unCheckedChildren="No" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Botones */}
                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                            <Button onClick={handleClose} size="middle" disabled={loading}>
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<CalendarOutlined />}
                                loading={loading}
                                size="middle"
                            >
                                Agendar Cita
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
