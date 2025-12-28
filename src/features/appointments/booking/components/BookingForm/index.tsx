"use client";

import { Form, FormInstance, Button, Space, Divider, Row, Col, Select, DatePicker, TimePicker, Input, InputNumber, Switch, Tag } from "antd";
import { Booking } from "../../types/booking.types";
import { useCustomers } from "@/features/customers/customer/hooks/useCustomers";
import { useServices } from "@/features/services-catalog/service/hooks/useServices";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useDebounce } from "@/hooks";

const { TextArea } = Input;

interface BookingFormProps {
    form: FormInstance;
    onFinish: (values: Partial<Booking>) => void;
    loading?: boolean;
    onCancel?: () => void;
    mode?: "create" | "edit";
}

export const BookingForm = ({
    form,
    onFinish,
    loading = false,
    onCancel,
    mode = "create",
}: BookingFormProps) => {
    const { customers, fetchCustomers } = useCustomers();
    const { services, fetchServices } = useServices();
    const [searchService, setSearchService] = useState("");
    const debouncedSearchService = useDebounce(searchService, 600);
    const { professionals, fetchProfessionals } = useProfessionals();
    const [selectedService, setSelectedService] = useState<number | null>(null);

    useEffect(() => {
        fetchCustomers({ is_active: true });
        fetchServices({ is_active: true, per_page: 100 });
        fetchProfessionals({ is_active: true });
    }, [fetchCustomers, fetchServices, fetchProfessionals]);

    useEffect(() => {
        fetchServices({ is_active: true, name: debouncedSearchService });
    }, [fetchServices, debouncedSearchService]);

    // Auto-calcular endTime y price cuando cambia el service
    const handleServiceChange = (serviceId: number) => {
        setSelectedService(serviceId);
        const service = services.find((s) => s.id === serviceId);
        const startTime = form.getFieldValue("startTime");

        if (service) {
            // Auto-completar precio del servicio
            if (service.price) {
                form.setFieldsValue({ price: service.price });
            }

            // Auto-calcular endTime si hay startTime
            if (startTime) {
                const endTime = dayjs(startTime).add(service.durationMinutes, "minute");
                form.setFieldsValue({ endTime });
            }
        }
    };

    const handleStartTimeChange = (time: Dayjs | null) => {
        form.setFieldsValue({ startTime: time });

        if (selectedService && time) {
            const service = services.find((s) => s.id === selectedService);
            if (service) {
                const endTime = dayjs(time).add(service.durationMinutes, "minute");
                form.setFieldsValue({ endTime });
            }
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
            style={{ marginTop: 24 }}
        >
            <Divider titlePlacement="left" style={{ marginTop: 0 }}>
                Información de la Cita
            </Divider>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Cliente"
                        name="customer"
                        rules={[{ required: true, message: "Selecciona un cliente" }]}
                    >
                        <Select
                            placeholder="Selecciona un cliente"
                            showSearch={{optionFilterProp: 'children'}}
                            disabled={mode === "edit"}
                            size="middle"
                        >
                            {customers.map((customer) => (
                                <Select.Option key={customer.id} value={customer.id!}>
                                    {customer.name} {customer.lastName} - {customer.phone}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Servicio"
                        name="service"
                        rules={[{ required: true, message: "Selecciona un servicio" }]}
                    >
                        <Select
                            placeholder="Selecciona un servicio"
                            showSearch={{optionFilterProp: 'children', onSearch: (value) => setSearchService(value)}}
                            size="middle"
                            onChange={handleServiceChange}
                        >
                            {services.map((service) => (
                                <Select.Option key={service.id} value={service.id!}>
                                    {service.name} ({service.durationMinutes} min)
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Precio"
                        name="price"
                        rules={[{ required: true, message: "Ingresa el precio" }]}
                    >
                        <InputNumber
                            placeholder="Precio del servicio"
                            style={{ width: "100%" }}
                            size="middle"
                            min={0}
                            precision={2}
                            prefix="S/."
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Profesional"
                        name="professional"
                        rules={[{ required: true, message: "Selecciona un profesional" }]}
                    >
                        <Select
                            placeholder="Selecciona un profesional"
                            showSearch={{optionFilterProp: 'children'}}
                            disabled={mode === "edit"}
                            size="middle"
                        >
                            {professionals.map((professional) => (
                                <Select.Option key={professional.id} value={professional.id!}>
                                    {professional.name} {professional.lastName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Fecha"
                        name="date"
                        rules={[
                            { required: true, message: "Selecciona una fecha" },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            placeholder="Selecciona fecha"
                            format="DD/MM/YYYY"
                            size="middle"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Hora de Inicio"
                        name="startTime"
                        rules={[{ required: true, message: "Selecciona hora de inicio" }]}
                    >
                        <TimePicker
                            style={{ width: "100%" }}
                            placeholder="Hora inicio"
                            format="HH:mm"
                            size="middle"
                            needConfirm={false}
                            minuteStep={15}
                            onChange={handleStartTimeChange}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label={
                            <Space>
                                <span>Hora de Fin</span>
                                <Tag color="blue">Auto-calculado</Tag>
                            </Space>
                        }
                        name="endTime"
                    >
                        <TimePicker
                            style={{ width: "100%" }}
                            placeholder="Calculado automáticamente"
                            format="HH:mm"
                            needConfirm={false}
                            size="middle"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Estado"
                        name="status"
                        rules={[{ required: true, message: "Selecciona un estado" }]}
                    >
                        <Select placeholder="Selecciona estado" size="middle">
                            <Select.Option value="pending">Pendiente</Select.Option>
                            <Select.Option value="confirmed">Confirmada</Select.Option>
                            <Select.Option value="cancelled">Cancelada</Select.Option>
                            <Select.Option value="completed">Completada</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                    <Space orientation="vertical" style={{ width: "100%" }}>
                        <Form.Item
                            label="Notificar por WhatsApp"
                            name="notifyByWhatsapp"
                            valuePropName="checked"
                            style={{ marginBottom: 8 }}
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            label="Notificar por Email"
                            name="notifyByEmail"
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                        >
                            <Switch />
                        </Form.Item>
                    </Space>
                </Col>

                <Col xs={24}>
                    <Form.Item label="Notas" name="notes">
                        <TextArea
                            placeholder="Notas adicionales (opcional)"
                            rows={3}
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                    <Button onClick={onCancel} size="middle">
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} size="middle">
                        {mode === "create" ? "Agendar Cita" : "Actualizar Cita"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
