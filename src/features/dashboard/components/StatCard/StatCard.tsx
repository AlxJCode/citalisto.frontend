"use client";

import { Card } from 'antd';
import { FC, ReactNode } from 'react';

interface StatCardProps {
    icon?: ReactNode;
    value: string | number;
    label: string;
    onClick?: () => void;
    iconBgColor?: string;
    iconColor?: string;
}

export const StatCard: FC<StatCardProps> = ({
    icon,
    value,
    label,
    onClick,
    iconBgColor = 'bg-blue-50',
    iconColor = 'text-blue-600',
}) => {
    return (
        <Card
            hoverable
            onClick={onClick}
            className="
                rounded-xl
                border border-gray-200
                transition-all
                duration-300
                hover:shadow-lg
                cursor-pointer
            "
        >
            <div className="flex items-center gap-4">
                {icon && (
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${iconBgColor} ${iconColor} text-lg`}>
                        {icon}
                    </div>
                )}

                <div>
                    <div className="text-sm text-gray-500">
                        {label}
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">
                        {value}
                    </div>
                </div>
            </div>
        </Card>
    );
};
