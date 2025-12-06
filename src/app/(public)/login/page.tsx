"use client";

import { Form, Input, Button, Checkbox, Avatar, Typography, Row, Col, Space, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useState } from "react";

const { Title, Text } = Typography;

interface LoginFormValues {
    username: string;
    password: string;
    remember?: boolean;
}

export default function LoginPage() {
    const [form] = Form.useForm();
    const { login, isPending } = useAuth();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoginFormValues) => {
        setLoading(true);
        try {
            const result = await login({
                username: values.username,
                password: values.password,
            });

            if (result.success) {
                message.success("¡Inicio de sesión exitoso!");
                // El redirect se maneja automáticamente por el layout (public)
            } else {
                message.error(result.error || "Error al iniciar sesión");
            }
        } catch (error) {
            message.error("Error inesperado al iniciar sesión");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row style={{ minHeight: "100vh" }}>
            {/* Lado Izquierdo - Formulario */}
            <Col
                xs={24}
                md={24}
                lg={12}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "clamp(24px, 5vw, 48px) clamp(16px, 4vw, 32px)",
                }}
            >
                <div style={{ width: "100%", maxWidth: 440 }}>
                    {/* Título */}
                    <div style={{ marginBottom: "clamp(32px, 5vw, 48px)" }}>
                        <Title
                            level={1}
                            style={{
                                fontSize: "clamp(28px, 4vw, 36px)",
                                fontWeight: 700,
                                marginBottom: 8,
                                fontFamily: "Inter, sans-serif",
                            }}
                        >
                            Bienvenido
                        </Title>
                        <Text style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "#6B7280" }}>
                            Inicia sesión para continuar con CitaListo
                        </Text>
                    </div>

                    {/* Formulario */}
                    <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                    >
                        <Form.Item
                            name="username"
                            label={
                                <Text style={{ fontSize: "clamp(13px, 1.5vw, 14px)", fontWeight: 500, color: "#374151" }}>
                                    Username
                                </Text>
                            }
                            rules={[{ required: true, message: "Por favor ingresa tu username" }]}
                            style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}
                        >
                            <Input
                                prefix={<MailOutlined style={{ color: "#9CA3AF" }} />}
                                placeholder="nombre@empresa.com o 87654321"
                                size="large"
                                style={{ height: "clamp(44px, 6vw, 48px)", borderRadius: 8, fontSize: "clamp(14px, 1.5vw, 16px)" }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label={
                                <Text style={{ fontSize: "clamp(13px, 1.5vw, 14px)", fontWeight: 500, color: "#374151" }}>
                                    Password
                                </Text>
                            }
                            rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}
                            style={{ marginBottom: "clamp(12px, 2vw, 16px)" }}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: "#9CA3AF" }} />}
                                placeholder="••••••••"
                                size="large"
                                style={{ height: "clamp(44px, 6vw, 48px)", borderRadius: 8, fontSize: "clamp(14px, 1.5vw, 16px)" }}
                            />
                        </Form.Item>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "clamp(24px, 4vw, 32px)",
                                flexWrap: "wrap",
                                gap: 12,
                            }}
                        >
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox style={{ fontSize: "clamp(13px, 1.5vw, 14px)", color: "#6B7280" }}>
                                    Recuérdame
                                </Checkbox>
                            </Form.Item>
                            <Link
                                href="/forgot-password"
                                style={{
                                    fontSize: "clamp(13px, 1.5vw, 14px)",
                                    fontWeight: 500,
                                    color: "var(--ant-primary-color)",
                                }}
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading || isPending}
                                disabled={loading || isPending}
                                style={{
                                    height: "clamp(44px, 6vw, 48px)",
                                    backgroundColor: "var(--ant-primary-color)",
                                    borderColor: "var(--ant-primary-color)",
                                    borderRadius: 8,
                                    fontSize: "clamp(14px, 2vw, 16px)",
                                    fontWeight: 500,
                                }}
                            >
                                {loading || isPending ? "Iniciando sesión..." : "Ingresar"}
                            </Button>
                        </Form.Item>

                        <div style={{ textAlign: "center", marginTop: "clamp(20px, 3vw, 24px)" }}>
                            <Text style={{ fontSize: "clamp(13px, 1.5vw, 14px)", color: "#6B7280" }}>
                                ¿No tienes cuenta?{" "}
                                <Link
                                    href="/register"
                                    style={{ fontWeight: 500, color: "var(--ant-primary-color)" }}
                                >
                                    Regístrate
                                </Link>
                            </Text>
                        </div>
                    </Form>
                </div>
            </Col>

            {/* Lado Derecho - Branding */}
            <Col
                xs={0}
                md={0}
                lg={12}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--ant-primary-color)",
                    padding: "clamp(32px, 5vw, 64px)",
                }}
            >
                <div style={{ maxWidth: 520, color: "#fff" }}>
                    <Title
                        level={1}
                        style={{
                            fontSize: "clamp(32px, 4vw, 48px)",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            marginBottom: "clamp(16px, 3vw, 24px)",
                            color: "#fff",
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        Gestiona tus citas fácilmente con CitaListo
                    </Title>
                    <Text
                        style={{
                            fontSize: "clamp(16px, 2vw, 20px)",
                            lineHeight: 1.6,
                            marginBottom: "clamp(32px, 5vw, 48px)",
                            color: "#fff",
                            opacity: 0.9,
                            display: "block",
                        }}
                    >
                        La plataforma rápida y sencilla para agendar citas con clientes, automatizar
                        recordatorios y mejorar tu productividad.
                    </Text>

                    {/* Avatares de comunidad */}
                    <Space size={16} align="center" wrap>
                        <Avatar.Group
                            max={{ count: 4 }}
                            size={48}
                            style={{
                                color: "var(--ant-primary-color)",
                                fontWeight: 600,
                            }}
                        >
                            <Avatar style={{ backgroundColor: "#87d068" }}>JD</Avatar>
                            <Avatar style={{ backgroundColor: "#1890ff" }}>MG</Avatar>
                            <Avatar style={{ backgroundColor: "#f56a00" }}>LS</Avatar>
                            <Avatar style={{ backgroundColor: "#7265e6" }}>AK</Avatar>
                        </Avatar.Group>
                        <div>
                            <div style={{ fontSize: "clamp(13px, 1.5vw, 14px)", fontWeight: 600 }}>
                                +2,500 usuarios activos
                            </div>
                            <div style={{ fontSize: "clamp(11px, 1.2vw, 12px)", opacity: 0.75 }}>
                                Confiando en CitaListo
                            </div>
                        </div>
                    </Space>
                </div>
            </Col>
        </Row>
    );
}
