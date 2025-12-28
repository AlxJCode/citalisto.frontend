"use client";

import { Card, Typography } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { TopService } from '../../types/dashboard.types';
import styles from './styles.module.css';

const { Text } = Typography;

interface TopServicesCardProps {
    services: TopService[];
}

export const TopServicesCard = ({ services }: TopServicesCardProps) => {
    return (
        <Card
            title="Top Servicios"
            className="rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg"
            style={{ height: '285px' }}
            size='small'
            styles={{ body: { padding: '1rem', overflow: 'hidden' } }}
        >
            <div className={styles.servicesContainer}>
                {services.map((service, index) => (
                    <div
                        key={service.name}
                        className="flex items-center gap-3 pb-3"
                        style={{
                            borderBottom: index < services.length - 1 ? '1px solid #f0f0f0' : 'none',
                        }}
                    >
                        <div
                            className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold ${
                                index === 0
                                    ? 'bg-yellow-50 text-yellow-600'
                                    : index === 1
                                    ? 'bg-gray-100 text-gray-600'
                                    : index === 2
                                    ? 'bg-orange-50 text-orange-600'
                                    : 'bg-blue-50 text-blue-600'
                            }`}
                        >
                            {index === 0 ? <TrophyOutlined style={{ fontSize: '14px' }} /> : index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{service.name}</div>
                            <Text type="secondary" className="text-xs">
                                {service.count} reservas
                            </Text>
                        </div>

                        <div className="text-right">
                            <div className="text-sm font-semibold text-green-600">
                                S/.{parseFloat(service.revenue).toLocaleString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
