"use client";

import { Typography, Card, Space } from "antd";

export default function PanelPage() {
    return (
        <Space orientation="vertical" size="large" style={{ width: "100%" }}>
            <Typography.Title level={3} style={{ margin: 0 }}>
                Bienvenido al Panel
            </Typography.Title>

            <Typography.Text type="secondary">
                Este es tu espacio principal. Aquí podrás acceder a tus módulos, gestionar datos y
                visualizar información importante del sistema.
            </Typography.Text>

            <Card>
                <Typography.Title level={5}>Estado General</Typography.Title>

                <Typography.Paragraph>
                    Pronto verás un resumen de tus métricas, notificaciones o accesos rápidos.
                </Typography.Paragraph>
            </Card>
        </Space>
    );
}
