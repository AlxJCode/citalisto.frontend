"use client";

import { Form, Input, Button, Avatar, Upload, Divider } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";

const ProfilePage = () => {
    const [form] = Form.useForm();

    const handleSubmit = (values: unknown) => {
        console.log("Profile values:", values);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-1">Mi Perfil</h2>
            <p className="text-gray-500 mb-6">Administra tu información personal</p>

            <Divider />

            <div className="flex items-center gap-6 mb-8">
                <Avatar size={80} icon={<UserOutlined />} />
                <div>
                    <Upload>
                        <Button icon={<UploadOutlined />}>Cambiar foto</Button>
                    </Upload>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG o GIF. Máximo 2MB</p>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    firstName: "Juan",
                    lastName: "Pérez",
                    email: "juan.perez@example.com",
                    phone: "+51 987 654 321",
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label="Nombre"
                        name="firstName"
                        rules={[{ required: true, message: "Ingresa tu nombre" }]}
                    >
                        <Input size="large" placeholder="Nombre" />
                    </Form.Item>

                    <Form.Item
                        label="Apellido"
                        name="lastName"
                        rules={[{ required: true, message: "Ingresa tu apellido" }]}
                    >
                        <Input size="large" placeholder="Apellido" />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Ingresa tu email" },
                        { type: "email", message: "Email inválido" },
                    ]}
                >
                    <Input size="large" placeholder="Email" />
                </Form.Item>

                <Form.Item label="Teléfono" name="phone">
                    <Input size="large" placeholder="Teléfono" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large">
                        Guardar cambios
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ProfilePage;
