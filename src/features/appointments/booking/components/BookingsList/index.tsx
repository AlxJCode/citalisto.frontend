"use client";

import { Table, TableColumnsType, Tag, message, Select } from "antd";
import { Booking, BookingStatus } from "../../types/booking.types";
import { Dispatch, SetStateAction } from "react";
import { EditBookingModal } from "../EditBookingModal";
import dayjs from "dayjs";
import { updateBookingApi } from "../../services/booking.api";

interface BookingsListProps {
    dataSource: Booking[];
    loading: boolean;
    onRefetch: () => void;
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
    onRefetch,
    setPage,
    page,
    count,
}: BookingsListProps) => {

    const columns: TableColumnsType<Booking> = [
        {
            title: "#",
            key: "index",
            width: 50,
            render: (_, __, index) => (page - 1) * 10 + index + 1,
        },
        {
            title: "Fecha",
            dataIndex: "date",
            key: "date",
            width: 110,
            render: (date, record) => (
                <div style={{ fontSize: "13px" }}>
                    <div>{dayjs(date, "YYYY-MM-DD").format("DD/MM/YYYY")}</div>
                    <div className="text-gray-500 text-xs">
                        {record.startTime ? dayjs(record.startTime, "HH:mm:ss").format("HH:mm") : "-"}
                    </div>
                </div>
            ),
        },
        {
            title: "Cliente",
            key: "customer",
            ellipsis: true,
            render: (_, record) => (
                <div style={{ fontSize: "13px" }}>
                    <div className="font-medium">
                        {record.customerModel
                            ? `${record.customerModel.name} ${record.customerModel.lastName}`
                            : "-"}
                    </div>
                    <div className="text-gray-500 text-xs">
                        {record.customerModel?.phone || "-"} • {record.customerModel?.email || "-"}
                    </div>
                </div>
            ),
        },
        {
            title: "Servicio",
            key: "service",
            ellipsis: true,
            render: (_, record) => (
                <span style={{ fontSize: "13px" }}>
                    {record.serviceModel?.name || "-"}
                    {record.price && (
                        <span className="text-gray-500 ml-1">
                            (S/. {record.price})
                        </span>
                    )}
                </span>
            ),
        },
        {
            title: "Profesional",
            key: "professional",
            ellipsis: true,
            render: (_, record) => (
                <span style={{ fontSize: "13px" }}>
                    {record.professionalModel
                        ? `${record.professionalModel.name} ${record.professionalModel.lastName}`
                        : "-"}
                </span>
            ),
        },
        {
            title: "Estado",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (status: BookingStatus, record) => (
                <Select
                    value={status}
                    onChange={async (newStatus) => {
                        if (newStatus === status) return;
                        const result = await updateBookingApi(record.id, { status: newStatus });
                        if (result.success) {
                            message.success('Estado actualizado');
                            onRefetch();
                        } else {
                            message.error('Error al actualizar');
                        }
                    }}
                    style={{ width: '100%' }}
                    size="small"
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
            width: 80,
            fixed: "right",
            render: (_, record) => (
                <EditBookingModal booking={record} onSuccess={onRefetch} />
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
            scroll={{ x: 1000 }}
            onRow={(record) => ({
                style: record.status === "cancelled"
                    ? {
                          backgroundColor: "#fafafa",
                          opacity: 0.6,
                      }
                    : undefined,
            })}
        />
    );
};
