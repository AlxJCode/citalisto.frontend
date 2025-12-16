import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TopService } from '../../types/dashboard.types';

const { Text } = Typography;

interface TopServicesTableProps {
    services: TopService[];
}

export const TopServicesTable = ({ services }: TopServicesTableProps) => {
    const columns: ColumnsType<TopService> = [
        {
            title: 'Servicio',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Reservas',
            dataIndex: 'count',
            key: 'count',
            align: 'center',
            width: 100,
        },
        {
            title: 'Ingresos',
            dataIndex: 'revenue',
            key: 'revenue',
            align: 'right',
            width: 120,
            render: (revenue: string) => (
                <Text strong>
                    {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'PEN',
                    }).format(parseFloat(revenue))}
                </Text>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={services}
            rowKey="name"
            pagination={false}
            size="small"
        />
    );
};
