"use client";

import { Form, Input, Button, Card, Switch, Divider } from "antd";
import { LockOutlined } from "@ant-design/icons";

const SecurityPage = () => {
    const [passwordForm] = Form.useForm();

    const handlePasswordChange = (values: unknown) => {
        console.log("Password change:", values);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-1">Seguridad</h2>
            <p className="text-gray-500 mb-6">Administra la seguridad de tu cuenta</p>

            <Divider />

            {/* Change Password Section */}
            <Card className="mb-6" bordered={false}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <LockOutlined />
                    Cambiar Contraseña
                </h3>
                <Form form={passwordForm} layout="vertical" onFinish={handlePasswordChange}>
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
                        <Button type="primary" htmlType="submit" size="large">
                            Actualizar contraseña
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* Two-Factor Authentication */}
            <Card bordered={false}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">
                            Autenticación de dos factores
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Agrega una capa adicional de seguridad a tu cuenta
                        </p>
                    </div>
                    <Switch />
                </div>
            </Card>
        </div>
    );
};

export default SecurityPage;
