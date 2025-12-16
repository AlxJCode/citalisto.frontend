import { Card, Statistic, Space, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface AttendanceCardProps {
    rate: number;
    completed: number;
    cancelled: number;
}

export const AttendanceCard = ({ rate, completed, cancelled }: AttendanceCardProps) => {
    const getColor = (rate: number) => {
        if (rate >= 80) return '#52c41a';
        if (rate >= 60) return '#faad14';
        return '#f5222d';
    };

    return (
        <Card style={{ height: '100%' }}>
            <Statistic
                title={<Typography.Text strong>Asistencia</Typography.Text>}
                value={rate}
                suffix="%"
                styles={{content: {color: getColor(rate)}}}
            />
            <Space className="mt-2" size="large">
                <Text type="secondary">
                    <Space size={4}>
                        <CheckCircleOutlined className="text-green-500 mr-1" />
                        {completed}
                    </Space>
                </Text>
                <Text type="secondary">
                    <Space size={4}>
                        <CloseCircleOutlined className="text-red-500 mr-1" />
                        {cancelled}
                    </Space>
                </Text>
            </Space>
        </Card>
    );
};
