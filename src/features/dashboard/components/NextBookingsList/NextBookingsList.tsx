import { Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { NextBooking } from '../../types/dashboard.types';
import dayjs from 'dayjs';

const { Text } = Typography;

interface NextBookingsListProps {
    bookings: NextBooking[];
}

const statusColors: Record<NextBooking['status'], string> = {
    pending: 'default',
    confirmed: 'blue',
    cancelled: 'red',
    completed: 'green',
};

const statusLabels: Record<NextBooking['status'], string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada',
};

export const NextBookingsList = ({ bookings }: NextBookingsListProps) => {

    const columns: ColumnsType<NextBooking> = [
        {
            title: 'Fecha y Hora',
            key: 'datetime',
            render: (_, record) => (
                <div>
                    <div>{dayjs(record.date).format('DD/MM/YYYY')}</div>
                    <Text type="secondary" className="text-xs">
                        {record.startTime.substring(0, 5)}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Cliente',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Servicio',
            dataIndex: 'serviceName',
            key: 'serviceName',
            responsive: ['md'],
        },
        {
            title: 'Profesional',
            dataIndex: 'professionalName',
            key: 'professionalName',
            responsive: ['lg'],
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status: NextBooking['status']) => (
                <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={bookings}
            rowKey="id"
            pagination={false}
            size="small"
        />
    );
};
