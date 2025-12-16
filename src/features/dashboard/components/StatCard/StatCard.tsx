import { Card, Statistic, Typography } from 'antd';
import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: number;
    icon?: ReactNode;
    suffix?: string;
    prefix?: string;
}

export const StatCard = ({ title, value, icon, suffix, prefix }: StatCardProps) => {
    return (
        <Card  style={{ height: '100%' }}>
            <Statistic
                title={<Typography.Text strong>{title}</Typography.Text>}
                value={value}
                prefix={icon || prefix}
                suffix={suffix}
                styles={{content: { color: "#1890ff" }}}
            />
        </Card>
    );
};
