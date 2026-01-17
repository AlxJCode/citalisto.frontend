"use client";

import { Form, Input, Button, Card } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";

export const ChangePasswordCard = () => {
    const [form] = Form.useForm();
    const { changePassword, loading } = useChangePassword();

    const handlePasswordChange = async (values: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        const result = await changePassword({
            current_password: values.currentPassword,
            new_password: values.newPassword,
        });

        if (result.success) {
            form.resetFields();
        } else if (result.errorFields) {
            form.setFields(
                Object.entries(result.errorFields).map(([name, errors]) => ({
                    name,
                    errors,
                }))
            );
        }
    };

    return (
        <Card className="mb-6" variant="borderless">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <LockOutlined />
                Cambiar Contraseña
            </h3>
            <Form form={form} layout="vertical" onFinish={handlePasswordChange}>
                <Form.Item
                    label="Contraseña actual"
                    name="currentPassword"
                    rules={[{ required: true, message: "Ingresa tu contraseña actual" }]}
                >
                    <Input.Password size="large" placeholder="Contraseña actual" />
                </Form.Item>

                <Form.Item
                    label="Nueva contraseña"
                    name="newPassword"
                    rules={[
                        { required: true, message: "Ingresa tu nueva contraseña" },
                        { min: 8, message: "Mínimo 8 caracteres" },
                    ]}
                >
                    <Input.Password size="large" placeholder="Nueva contraseña" />
                </Form.Item>

                <Form.Item
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    rules={[
                        { required: true, message: "Confirma tu contraseña" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("Las contraseñas no coinciden")
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" placeholder="Confirmar contraseña" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" loading={loading}>
                        Actualizar contraseña
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
