import { Card, Table } from "antd";
import { FC } from "react";
import type { ColumnsType } from "antd/es/table";

interface Service {
    name: string;
    bookings: number;
    revenue: number;
}

interface TopServicesCardProps {
    services: Service[];
}

const TopServicesCard: FC<TopServicesCardProps> = ({ services }) => {
    const columns: ColumnsType<Service> = [
        {
            title: "Servicio",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
        },
        {
            title: "Reservas",
            dataIndex: "bookings",
            key: "bookings",
            width: 90,
            align: "center",
        },
        {
            title: "Ingresos",
            dataIndex: "revenue",
            key: "revenue",
            width: 100,
            align: "right",
            render: (value: number) => `$${value.toLocaleString()}`,
        },
    ];

    return (
        <Card
            title="Top 3 Servicios del Mes"
            style={{
                borderRadius: "8px",
                border: "1px solid #f0f0f0",
                height: "100%",
            }}
        >
            <Table
                columns={columns}
                dataSource={services}
                pagination={false}
                size="small"
                rowKey="name"
            />
        </Card>
    );
};

export default TopServicesCard;
