import { Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FC } from 'react';
import { NextBooking } from '../../types/dashboard.types';
import dayjs from 'dayjs';
import styles from './styles.module.css';

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

export const NextBookingsList: FC<NextBookingsListProps> = ({ bookings }) => {
    const getDateLabel = (date: string) => {
        const bookingDate = dayjs(date);
        const today = dayjs().startOf('day');
        const tomorrow = today.add(1, 'day');

        if (bookingDate.isSame(today, 'day')) {
            return 'Hoy';
        }
        if (bookingDate.isSame(tomorrow, 'day')) {
            return 'Mañana';
        }
        return bookingDate.format('DD/MM/YYYY');
    };

    const columns: ColumnsType<NextBooking> = [
        {
            title: 'Fecha y Hora',
            key: 'datetime',
            width: 120,
            render: (_, record) => (
                <div>
                    <div className="font-medium">{getDateLabel(record.date)}</div>
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
            width: 150,
        },
        {
            title: 'Servicio',
            dataIndex: 'serviceName',
            key: 'serviceName',
            width: 150,
        },
        {
            title: 'Profesional',
            dataIndex: 'professionalName',
            key: 'professionalName',
            width: 150,
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: NextBooking['status']) => (
                <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
            ),
        },
    ];

    return (
        <div className={styles.tableWrapper}>
            <Table
                columns={columns}
                dataSource={bookings}
                rowKey="id"
                pagination={false}
                size="small"
                scroll={{ x: 480 }}
            />
        </div>
    );
};
