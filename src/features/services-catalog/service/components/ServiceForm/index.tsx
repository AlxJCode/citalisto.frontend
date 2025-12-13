"use client";

import { Form, FormInstance, Input, InputNumber, Button, Space, Row, Col, Divider, Switch, Select } from "antd";
import { Service } from "../../types/service.types";
import { useBranches } from "@/features/organizations/branch/hooks/useBranches";
import { useEffect } from "react";

interface ServiceFormProps {
    form: FormInstance;
    onFinish: (values: Partial<Service>) => void;
    loading?: boolean;
    onCancel?: () => void;
    mode?: "create" | "edit";
}

export const ServiceForm = ({
    form,
    onFinish,
    loading = false,
    onCancel,
    mode = "create",
}: ServiceFormProps) => {
    const { branches, fetchBranches } = useBranches();

    useEffect(() => {
        fetchBranches({ is_active: true });
    }, [fetchBranches]);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
            style={{ marginTop: 24 }}
        >
            {/* Información Básica */}
            <Divider titlePlacement="left" style={{ marginTop: 0 }}>
                Información Básica
            </Divider>

            <Form.Item
                label="Nombre del Servicio"
                name="name"
                rules={[
                    { required: true, message: "El nombre es requerido" },
                    { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
                ]}
            >
                <Input placeholder="Ej: Limpieza dental, Consulta general" size="middle" />
            </Form.Item>

            {mode === "create" && (
                <div>
                    <Form.Item
                        label="Sucursal"
                        name="branch"
                        rules={[
                            { required: true, message: "La sucursal es requerida" },
                        ]}
                    >
                        <Select
                            placeholder="Selecciona una sucursal"
                            showSearch={{optionFilterProp: "children"}}
                            size="middle"
                        >
                            {branches.map((branch) => (
                                <Select.Option key={branch.id} value={branch.id!}>
                                    {branch.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
            )}

            <Form.Item label="Descripción" name="description">
                <Input.TextArea
                    rows={4}
                    placeholder="Describe en qué consiste el servicio..."
                    showCount
                    maxLength={500}
                    size="middle"
                />
            </Form.Item>

            <Form.Item
                label="Servicio Público"
                name="isPublic"
                valuePropName="checked"
                tooltip="Los servicios públicos son visibles para los pacientes al agendar citas"
            >
                <Switch
                    checkedChildren="Público"
                    unCheckedChildren="Privado"
                />
            </Form.Item>

            {/* Detalles del Servicio */}
            <Divider titlePlacement="left" styles={{ content: { margin: 0 } }}>
                Detalles del Servicio
            </Divider>

            <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Precio"
                        name="price"
                        rules={[
                            /* { required: true, message: "El precio es requerido" }, */
                            {
                                type: "number",
                                min: 0.01,
                                message: "El precio debe ser mayor a 0",
                            },
                        ]}
                    >
                        <InputNumber
                            prefix="S/."
                            style={{ width: "100%" }}
                            min={0}
                            step={0.01}
                            precision={2}
                            placeholder="0.00"
                            size="middle"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Duración"
                        name="durationMinutes"
                        rules={[
                            /* { required: true, message: "La duración es requerida" }, */
                            {
                                type: "number",
                                min: 1,
                                message: "La duración debe ser mayor a 0",
                            },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={1}
                            step={5}
                            placeholder="60"
                            size="middle"
                            suffix="minutos"
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* Botones de Acción */}
            <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                    <Button onClick={onCancel} size="middle">
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} size="middle">
                        {mode === "create" ? "Guardar Servicio" : "Actualizar Servicio"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
