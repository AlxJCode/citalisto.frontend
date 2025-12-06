"use client";

import { Table, Space, TableColumnsType, Tag } from "antd";
import { Customer } from "../../types/customer.types";
import { Dispatch, SetStateAction } from "react";
import { EditCustomerModal } from "../EditCustomerModal";
import { DeleteCustomerModal } from "../DeleteCustomerModal";
import dayjs from "dayjs";

interface CustomersListProps {
    dataSource: Customer[];
    loading: boolean;
    setChanges: Dispatch<SetStateAction<boolean>>;
    setPage: Dispatch<SetStateAction<number>>;
    page: number;
    count: number;
}

export const CustomersList = ({
    dataSource,
    loading,
    setChanges,
    setPage,
    page,
    count,
}: CustomersListProps) => {
    const columns: TableColumnsType<Customer> = [
        {
            title: "#",
            key: "index",
            width: 60,
            render: (_, __, index) => (page - 1) * 10 + index + 1,
        },
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
        },
        {
            title: "Apellido",
            dataIndex: "lastName",
            key: "lastName",
            ellipsis: true,
        },
        {
            title: "Teléfono",
            dataIndex: "phone",
            key: "phone",
            width: 130,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ellipsis: true,
            render: (text) => text || "-",
        },
        {
            title: "Acciones",
            key: "actions",
            width: 120,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <EditCustomerModal
                        customer={record}
                        onSuccess={() => setChanges((prev) => !prev)}
                    />
                    <DeleteCustomerModal
                        customer={record}
                        onSuccess={() => setChanges((prev) => !prev)}
                    />
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
            rowClassName={(record) => (!record.isActive ? "table-row-inactive" : "")}
            pagination={{
                pageSize: 10,
                total: count,
                current: page,
                showSizeChanger: false,
                onChange: (page) => setPage(page),
                showTotal: (total) => (
                    <span style={{ flex: "0 0 auto" }}>Total: {total} clientes</span>
                ),
            }}
            scroll={{ x: 1000 }}
        />
    );
};
