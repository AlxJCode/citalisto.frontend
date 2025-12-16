"use client";

import { useEffect } from "react";
import { Form, FormInstance, Input, Button, Space, Divider, Row, Col, Select } from "antd";
import { Professional } from "../../types/professional.types";
import { useServices } from "@/features/services-catalog/service/hooks/useServices";
import { useBranches } from "@/features/organizations/branch/hooks/useBranches";

interface ProfessionalFormProps {
    form: FormInstance;
    onFinish: (values: Partial<Professional>) => void;
    loading?: boolean;
    onCancel?: () => void;
    mode?: "create" | "edit";
}

export const ProfessionalForm = ({
    form,
    onFinish,
    loading = false,
    onCancel,
    mode = "create",
}: ProfessionalFormProps) => {
    const { services, loading: loadingServices, fetchServices } = useServices();
    const { branches, loading: loadingBranches, fetchBranches } = useBranches();

    useEffect(() => {
        fetchServices({ is_active: true, per_page: 100 });
        fetchBranches({ is_active: true, per_page: 100 });
    }, []);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
            style={{ marginTop: 24 }}
        >
            <Divider titlePlacement="left" style={{ marginTop: 0 }}>
                Datos Personales
            </Divider>

            <Row gutter={16}>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Nombres"
                        name="name"
                        rules={[
                            { required: true, message: "El nombre es requerido" },
                            { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
                        ]}
                    >
                        <Input placeholder="Ej: Juan" size="middle" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Apellidos"
                        name="lastName"
                        rules={[
                            { required: true, message: "El apellido es requerido" },
                            { min: 3, message: "El apellido debe tener al menos 3 caracteres" },
                        ]}
                    >
                        <Input placeholder="Ej: Pérez" size="middle" />
                    </Form.Item>
                </Col>
            </Row>

            <Divider titlePlacement="left">Información de Contacto</Divider>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "El email es requerido" },
                            {
                                type: "email",
                                message: "Ingresa un email válido",
                            },
                        ]}
                    >
                        <Input placeholder="Ej: profesional@example.com" size="middle" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Teléfono"
                        name="phone"
                        rules={[
                            { required: true, message: "El teléfono es requerido" },
                            {
                                pattern: /^[0-9]{9}$/,
                                message: "El teléfono debe tener 9 dígitos",
                            },
                        ]}
                    >
                        <Input placeholder="Ej: 987654321" size="middle" maxLength={9} />
                    </Form.Item>
                </Col>
            </Row>

            <Divider titlePlacement="left">Información Profesional</Divider>

            <Row gutter={16}>
                <Col xs={24}>
                    <Form.Item
                        label="Sucursal"
                        name="branch"
                        rules={[
                            { required: true, message: "La sucursal es requerida" },
                        ]}
                    >
                        <Select
                            placeholder="Selecciona una sucursal"
                            size="middle"
                            options={branches.map((branch) => ({
                                label: branch.name,
                                value: branch.id,
                            }))}
                            loading={loadingBranches}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        label="Servicios"
                        name="services"
                        rules={[
                            { required: true, message: "Selecciona al menos un servicio" },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Selecciona servicios"
                            size="middle"
                            options={services.map((service) => ({
                                label: service.name,
                                value: service.id,
                            }))}
                            loading={loadingServices}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item label="Descripción" name="description">
                        <Input.TextArea
                            rows={4}
                            placeholder="Información adicional sobre el profesional..."
                            showCount
                            maxLength={500}
                            size="middle"
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
                        {mode === "create" ? "Guardar Profesional" : "Actualizar Profesional"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
