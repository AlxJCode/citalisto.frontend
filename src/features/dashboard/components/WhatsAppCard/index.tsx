"use client";

import { Card, Progress, Typography } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

interface WhatsAppCardProps {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
    periodStart: string;
    periodEnd: string;
}

export const WhatsAppCard = ({
    used,
    limit,
    remaining,
    percentage,
    periodStart,
    periodEnd,
}: WhatsAppCardProps) => {
    const getColor = () => {
        if (percentage >= 90) return '#ff4d4f';
        if (percentage >= 70) return '#faad14';
        return '#52c41a';
    };

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <WhatsAppOutlined className="text-green-600" />
                    <span>WhatsApp</span>
                </div>
            }
            size='small'
            className="rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg"
            style={{ height: '285px' }}
            styles={{ body: { padding: '1.5rem' } }}
        >
            <div className="flex flex-col gap-4">
                <Text type="secondary" className="text-sm text-center">
                    {dayjs(periodStart).format('DD MMM')} - {dayjs(periodEnd).format('DD MMM YY')}
                </Text>

                <div className="flex justify-center">
                    <Progress
                        type="circle"
                        percent={percentage}
                        strokeColor={getColor()}
                        size={100}
                        format={(percent) => (
                            <div>
                                <div className="text-2xl font-bold">{percent}%</div>
                            </div>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                        <div className="text-lg font-semibold text-gray-900">{used}</div>
                        <div className="text-xs text-gray-500">Usados</div>
                    </div>
                    <div>
                        <div className="text-lg font-semibold" style={{ color: getColor() }}>{remaining}</div>
                        <div className="text-xs text-gray-500">Restantes</div>
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-gray-900">{limit}</div>
                        <div className="text-xs text-gray-500">Límite</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
