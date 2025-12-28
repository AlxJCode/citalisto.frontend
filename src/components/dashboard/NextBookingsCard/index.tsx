import { Card, List, Tag, Empty } from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import { FC } from "react";
import dayjs from "dayjs";

interface Booking {
    id: string;
    startTime: string;
    serviceName: string;
    clientName: string;
    professionalName: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
}

interface NextBookingsCardProps {
    bookings: Booking[];
}

const statusColors: Record<string, string> = {
    pending: "orange",
    confirmed: "green",
    cancelled: "red",
    completed: "blue",
};

const statusLabels: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
};

const NextBookingsCard: FC<NextBookingsCardProps> = ({ bookings }) => {
    return (
        <Card
            title="Próximas 5 Citas"
            style={{
                borderRadius: "8px",
                border: "1px solid #f0f0f0",
                height: "100%",
            }}
            styles={{ body: { maxHeight: "300px", overflowY: "auto" } }}
        >
            {bookings.length === 0 ? (
                <Empty description="No hay próximas citas" />
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={bookings}
                    renderItem={(booking) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <div
                                        style={{
                                            backgroundColor: "#f0f0f0",
                                            borderRadius: "8px",
                                            padding: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ClockCircleOutlined style={{ fontSize: "16px" }} />
                                    </div>
                                }
                                title={
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span style={{ fontWeight: 500 }}>
                                            {dayjs(booking.startTime).format("DD/MM HH:mm")}
                                        </span>
                                        <Tag color={statusColors[booking.status]}>
                                            {statusLabels[booking.status]}
                                        </Tag>
                                    </div>
                                }
                                description={
                                    <div style={{ fontSize: "12px" }}>
                                        <div style={{ marginBottom: "2px" }}>
                                            <strong>{booking.serviceName}</strong>
                                        </div>
                                        <div style={{ color: "#666" }}>
                                            <UserOutlined style={{ marginRight: "4px" }} />
                                            {booking.clientName} • {booking.professionalName}
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </Card>
    );
};

export default NextBookingsCard;
