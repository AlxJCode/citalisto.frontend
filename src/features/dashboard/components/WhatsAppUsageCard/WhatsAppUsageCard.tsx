import { Card, Progress, Space, Typography } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface WhatsAppUsageCardProps {
    used: number;
    limit: number;
    remaining: number;
    percentage: number;
}

export const WhatsAppUsageCard = ({
    used,
    limit,
    remaining,
    percentage,
}: WhatsAppUsageCardProps) => {
    const getProgressColor = (percent: number) => {
        if (percent < 50) return '#52c41a';
        if (percent < 80) return '#faad14';
        return '#f5222d';
    };

    return (
        <Card style={{ height: '100%' }}>
            <Space orientation="vertical" style={{ width: '100%' }} size="small">
                <div className="flex items-center justify-between">
                    <Space>
                        <WhatsAppOutlined className="mr-2" />
                        <Text strong>
                            WhatsApp
                        </Text>
                    </Space>
                </div>
                <Progress
                    percent={percentage}
                    strokeColor={getProgressColor(percentage)}
                    format={() => `${percentage}%`}
                />
                <div className="flex justify-between text-sm">
                    <Text type="secondary">
                        {used} / {limit}
                    </Text>
                    <Text type="secondary">Restan: {remaining}</Text>
                </div>
            </Space>
        </Card>
    );
};
