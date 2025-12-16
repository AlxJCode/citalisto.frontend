import { Card, Typography } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

interface RevenueCardProps {
    monthly: string;
    total: string;
}

export const RevenueCard = ({ monthly, total }: RevenueCardProps) => {
    const currentMonth = new Date().toLocaleDateString('es-ES', { month: 'short' });

    return (
        <Card style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <DollarOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                <Typography.Text strong>Ingresos</Typography.Text>
            </div>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'baseline' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px', textTransform: 'capitalize' }}>{currentMonth}</div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#52c41a' }}>
                        S/.{parseFloat(monthly).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div style={{ flex: 1, paddingLeft: '24px', borderLeft: '1px solid #f0f0f0' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>Total</div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#595959' }}>
                        S/.{parseFloat(total).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>
        </Card>
    );
};
