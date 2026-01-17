"use client";

import { Card, Switch } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

export const AutoConfirmationCard = () => {
    return (
        <Card className="mb-4" variant="borderless">
            <div className="flex items-center gap-3 mb-4">
                <CheckCircleOutlined className="text-xl text-green-600" />
                <h3 className="text-lg font-semibold">Confirmaciones Automáticas</h3>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between py-2 bg-gray-50 px-3 rounded-lg">
                    <div>
                        <div className="font-medium">Confirmación automática al agendar</div>
                        <div className="text-sm text-gray-500">
                            Las citas se confirman automáticamente sin necesidad de aprobación adicional del negocio o cliente
                        </div>
                    </div>
                    <Switch checked disabled />
                </div>
            </div>
        </Card>
    );
};
