"use client";

import { Table, Space, TableColumnsType, Tag, Typography, Select, message } from "antd";
import { Booking, BookingStatus } from "../../types/booking.types";
import { Dispatch, SetStateAction } from "react";
import { EditBookingModal } from "../EditBookingModal";
import { DeleteBookingModal } from "../DeleteBookingModal";
import dayjs from "dayjs";
import { MailOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { updateBookingApi } from "../../services/booking.api";

interface BookingsListProps {
    dataSource: Booking[];
    loading: boolean;
    setChanges: Dispatch<SetStateAction<boolean>>;
    setPage: Dispatch<SetStateAction<number>>;
    page: number;
    count: number;
}

const statusColors = {
    pending: "warning",
    confirmed: "processing",
    cancelled: "default",
    completed: "success",
};

const statusLabels = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
};

export const BookingsList = ({
    dataSource,
    loading,
    setChanges,
    setPage,
    page,
    count,
}: BookingsListProps) => {
    const columns: TableColumnsType<Booking> = [
        {
            title: "#",
            key: "index",
            width: 60,
            render: (_, __, index) => (page - 1) * 10 + index + 1,
        },
        {
            title: "Fecha",
            dataIndex: "date",
            key: "date",
            width: 120,
            render: (date, record) => {
                return (
                    <span>{`${dayjs(date, "YYYY-MM-DD").format("DD/MM/YYYY")} ${record.startTime ? dayjs(record.startTime, "HH:mm:ss").format("HH:mm") : ""}`}</span>
                )
            }
        },
        {
            title: "Cliente",
            key: "customer",
            ellipsis: true,
            render: (_, record) => {
                return (
                    <Space orientation="vertical" size={0}>
                        <div>{record.customerModel ? `${record.customerModel.name} ${record.customerModel.lastName}` : "-"}</div>
                        <Typography.Text type="secondary" style={{fontSize: "12px", marginBottom: "0", paddingBottom: "0"}}>{record.customerModel ? record.customerModel.phone : "-"}</Typography.Text>
                        <Typography.Text type="secondary"  style={{fontSize: "12px"}}>{record.customerModel ? record.customerModel.email : "-"}</Typography.Text>
                    </Space>
                )
            }
                
        },
        {
            title: "Servicio",
            key: "service",
            ellipsis: true,
            render: (_, record) => {
                return (
                    <div>
                        <div>
                            {record.serviceModel ? record.serviceModel.name : "-"}
                        </div>
                        <div>
                            {record?.price ? `(S/. ${record?.price})`: ""}
                        </div>
                    </div>
                )
            },
        },
        {
            title: "Profesional",
            key: "professional",
            ellipsis: true,
            render: (_, record) =>
                record.professionalModel
                    ? `${record.professionalModel.name} ${record.professionalModel.lastName}`
                    : "-",
        },
        {
            title: "Notificación",
            dataIndex: "notification",
            key: "notification",
            render: (_, record) => {
                return (
                    <Space wrap>
                        {record.notifyByWhatsapp && <Tag color="green" icon={<WhatsAppOutlined />}>WhatsApp</Tag>}
                        {record.notifyByEmail && <Tag color="blue" icon={<MailOutlined />}>Email</Tag>}
                        {!record.notifyByEmail && !record.notifyByWhatsapp && <Tag color="default">Sin notificar</Tag>}
                    </Space>
                )
            },
        },
        {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            width: 150,
            render: (status: BookingStatus, record) => (
                <Select
                    value={status}
                    onChange={async (newStatus) => {
                        if (newStatus === status) return;
                        const result = await updateBookingApi(record.id, { status: newStatus });
                        if (result.success) {
                            message.success('Estado actualizado');
                            setChanges((prev) => !prev);
                        } else {
                            message.error('Error al actualizar');
                        }
                    }}
                    style={{ width: '100%' }}
                    options={[
                        { value: 'pending', label: <Tag color="warning" variant="solid">Pendiente</Tag> },
                        { value: 'confirmed', label: <Tag color="processing" variant="solid">Confirmada</Tag> },
                        { value: 'completed', label: <Tag color="success" variant="solid">Completada</Tag> },
                        { value: 'cancelled', label: <Tag color="error" variant="solid">Cancelada</Tag> },
                    ]}
                />
            ),
        },
        {
            title: "Acciones",
            key: "actions",
            width: 120,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <EditBookingModal
                        booking={record}
                        onSuccess={() => setChanges((prev) => !prev)}
                    />
                    {/* <DeleteBookingModal
                        booking={record}
                        onSuccess={() => setChanges((prev) => !prev)}
                    /> */}
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowKey="id"
            size="middle"
            pagination={{
                pageSize: 10,
                total: count,
                current: page,
                showSizeChanger: false,
                onChange: (page) => setPage(page),
                showTotal: (total) => (
                    <span style={{ flex: "0 0 auto" }}>Total: {total} citas</span>
                ),
            }}
            scroll={{ x: 1200 }}
        />
    );
};
