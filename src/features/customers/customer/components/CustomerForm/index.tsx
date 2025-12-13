"use client";

import { Form, FormInstance, Input, Button, Space, Divider, Row, Col } from "antd";
import { Customer } from "../../types/customer.types";

interface CustomerFormProps {
    form: FormInstance;
    onFinish: (values: Partial<Customer>) => void;
    loading?: boolean;
    onCancel?: () => void;
    mode?: "create" | "edit";
}

export const CustomerForm = ({
    form,
    onFinish,
    loading = false,
    onCancel,
    mode = "create",
}: CustomerFormProps) => {
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
            style={{ marginTop: 24 }}
        >
            <Divider titlePlacement="left" style={{ marginTop: 0 }}>
                Información del Cliente
            </Divider>

            <Row gutter={16}>
                <Col xs={24} md={12}>
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

                <Col xs={24} md={12}>
                    <Form.Item
                        label="Apellidos"
                        name="lastName"
                        rules={[
                            { required: true, message: "El apellido es requerido" },
                            { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
                        ]}
                    >
                        <Input placeholder="Ej: Pérez" size="middle" />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
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
                        <Input placeholder="Ej: cliente@example.com" size="middle" />
                    </Form.Item>
                </Col>

                <Col xs={24} md={12}>
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

            <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                    <Button onClick={onCancel} size="middle">
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} size="middle">
                        {mode === "create" ? "Guardar Cliente" : "Actualizar Cliente"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
