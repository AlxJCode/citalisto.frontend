"use client";

import { Card, Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

export const TwoFactorAuthCard = () => {
    return (
        <Card variant="borderless">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold mb-1">
                        Autenticación de dos factores
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Agrega una capa adicional de seguridad a tu cuenta
                    </p>
                </div>
                <Tag icon={<ClockCircleOutlined />} color="blue">
                    Próximamente
                </Tag>
            </div>
        </Card>
    );
};
