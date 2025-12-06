"use client";

import { Form, FormInstance, Input, Button, Space, Divider } from "antd";
import { Branch } from "../../types/branch.types";

interface BranchFormProps {
    form: FormInstance;
    onFinish: (values: Partial<Branch>) => void;
    loading?: boolean;
    onCancel?: () => void;
    mode?: "create" | "edit";
}

export const BranchForm = ({
    form,
    onFinish,
    loading = false,
    onCancel,
    mode = "create",
}: BranchFormProps) => {
    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
            style={{ marginTop: 24 }}
        >
            <Divider titlePlacement="left" style={{ marginTop: 0 }}>
                Información de la Sucursal
            </Divider>

            <Form.Item
                label="Nombre de la Sucursal"
                name="name"
                rules={[
                    { required: true, message: "El nombre es requerido" },
                    { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
                ]}
            >
                <Input placeholder="Ej: Sucursal Centro, Sede Norte" size="middle" />
            </Form.Item>

            <Form.Item
                label="Dirección"
                name="address"
                rules={[{ required: true, message: "La dirección es requerida" }]}
            >
                <Input.TextArea
                    rows={3}
                    placeholder="Ingresa la dirección completa de la sucursal..."
                    showCount
                    maxLength={200}
                    size="middle"
                />
            </Form.Item>

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

            <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                    <Button onClick={onCancel} size="middle">
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} size="middle">
                        {mode === "create" ? "Guardar Sucursal" : "Actualizar Sucursal"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
