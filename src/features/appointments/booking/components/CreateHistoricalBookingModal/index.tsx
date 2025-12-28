"use client";

import { useState, useEffect } from "react";
import { Modal, Form, Select, DatePicker, TimePicker, Button, Space, Row, Col, Input } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import { useBranches } from "@/features/organizations/branch/hooks/useBranches";
import { useCustomers } from "@/features/customers/customer/hooks/useCustomers";
import { useBookings } from "../../hooks/useBookings";
import { AddCustomerModal } from "@/features/customers/customer/components/AddCustomerModal";
import { Professional } from "@/features/professionals/professional/types/professional.types";
import { Service } from "@/features/services-catalog/service/types/service.types";
import { BookingApi } from "../../types/booking.types";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "@/providers/SessionProvider";
import { setBackendErrors } from "@/lib/utils/form";

const { TextArea } = Input;

interface HistoricalBookingFormValues {
    branch: number;
    customer: number;
    professional: number;
    service: number;
    date: Dayjs;
    startTime: Dayjs;
    endTime: Dayjs;
    price?: number;
    notes?: string;
}

interface CreateHistoricalBookingModalProps {
    onSuccess?: () => void;
}

export const CreateHistoricalBookingModal = ({ onSuccess }: CreateHistoricalBookingModalProps) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);

    const { branches, fetchBranches, loading: branchesLoading } = useBranches();
    const { customers, fetchCustomers, loading: customersLoading } = useCustomers();
    const { professionals, fetchProfessionals, loading: professionalsLoading } = useProfessionals();
    const { createHistoricalBooking } = useBookings();
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

    const onCancel = () => {
        setOpen(false);
    }

    const handleBranchChange = (branchId: number) => {
        setSelectedBranch(branchId);
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

        // Auto-completar precio y horas por defecto
        if (service) {
            if (service.price) {
                form.setFieldValue("price", service.price);
            }

            // Establecer horario por defecto basado en duración
            const now = dayjs();
            const start = now.set('hour', 9).set('minute', 0);
            const end = start.add(service.durationMinutes, 'minute');

            form.setFieldsValue({
                startTime: start,
                endTime: end
            });
        }
    };

    const handleFinish = async (values: HistoricalBookingFormValues) => {
        if (!userSession?.business) {
            return;
        }

        setLoading(true);

        const bookingData: Partial<BookingApi> = {
            business: userSession.business,
            branch: values.branch,
            professional: values.professional,
            service: values.service,
            customer: values.customer,
            date: values.date.format("YYYY-MM-DD"),
            start_time: values.startTime.format("HH:mm:ss"),
            end_time: values.endTime.format("HH:mm:ss"),
            price: values.price ? values.price : undefined,
            status: "completed",
            notes: values.notes || null,
            notify_by_whatsapp: false,
            notify_by_email: false,
            auto_confirmed: false,
            source: "business",
        };

        const result = await createHistoricalBooking(bookingData);
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
        onCancel();
    };

    return (
        <>
            <Button
                type="default"
                icon={<HistoryOutlined />}
                onClick={() => setOpen(true)}
            >
                Cita Histórica
            </Button>
            <Modal
                title="Registrar Cita Histórica"
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
                    >
                        <DatePicker
                            placeholder="Selecciona fecha pasada"
                            format="DD/MM/YYYY"
                            disabledDate={(current) => current && current >= dayjs().startOf('day')}
                            style={{ width: "100%" }}
                            size="middle"
                        />
                    </Form.Item>

                    {/* Horarios */}
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Hora de Inicio"
                                name="startTime"
                                rules={[{ required: true, message: "Selecciona hora de inicio" }]}
                            >
                                <TimePicker
                                    placeholder="Hora de inicio"
                                    format="HH:mm"
                                    style={{ width: "100%" }}
                                    size="middle"
                                    needConfirm={false}
                                    onChange={(time) => {
                                        // Auto-calcular endTime si hay servicio seleccionado
                                        if (time && selectedService?.durationMinutes) {
                                            const endTime = time.add(selectedService.durationMinutes, 'minute');
                                            form.setFieldValue("endTime", endTime);
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Hora de Fin"
                                name="endTime"
                                rules={[{ required: true, message: "Selecciona hora de fin" }]}
                            >
                                <TimePicker
                                    placeholder="Hora de fin"
                                    format="HH:mm"
                                    needConfirm={false}
                                    style={{ width: "100%" }}
                                    size="middle"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Precio */}
                    <Form.Item
                        label="Precio"
                        name="price"
                    >
                        <Input
                            placeholder="Precio del servicio"
                            type="number"
                            prefix="S/."
                            size="middle"
                        />
                    </Form.Item>

                    {/* Notas */}
                    <Form.Item
                        label="Notas"
                        name="notes"
                    >
                        <TextArea
                            placeholder="Ej: Cita realizada antes de implementar el sistema"
                            rows={3}
                            size="middle"
                        />
                    </Form.Item>

                    {/* Botones */}
                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                            <Button onClick={handleClose} size="middle" disabled={loading}>
                                Cancelar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<HistoryOutlined />}
                                loading={loading}
                                size="middle"
                            >
                                Registrar Cita Histórica
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
