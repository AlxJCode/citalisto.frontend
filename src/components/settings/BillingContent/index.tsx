import React from 'react';
import { Card } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

export const BillingContent = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="text-center max-w-md" variant="borderless">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                        <RocketOutlined className="text-4xl text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Próximamente
                    </h3>
                    <p className="text-gray-500">
                        Estamos trabajando en esta funcionalidad. Pronto podrás administrar tu facturación y suscripción desde aquí.
                    </p>
                </div>
            </Card>
        </div>
    );
};
