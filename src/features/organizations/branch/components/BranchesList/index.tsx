"use client";

import { Table, Button, Space, TableColumnsType } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Branch } from "../../types/branch.types";
import { Dispatch, SetStateAction } from "react";
import { EditBranchModal } from "../EditBranchModal";
import { DeleteBranchModal } from "../DeleteBranchModal";

interface BranchesListProps {
    dataSource: Branch[];
    loading: boolean;
    setChanges: Dispatch<SetStateAction<boolean>>;
    setPage: Dispatch<SetStateAction<number>>;
    page: number;
    count: number;
}

export const BranchesList = ({
    dataSource,
    loading,
    setChanges,
    setPage,
    page,
    count,
}: BranchesListProps) => {
    
    const columns: TableColumnsType<Branch> = [
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
            title: "Dirección",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
            render: (text) => text || "-",
        },
        {
            title: "Teléfono",
            dataIndex: "phone",
            key: "phone",
            width: 150,
            render: (text) => text || "-",
        },
        {
            title: "Acciones",
            key: "actions",
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <EditBranchModal branch={record} onSuccess={() => setChanges((prev) => !prev)} />
                    {/* <DeleteBranchModal branch={record} onSuccess={() => setChanges((prev) => !prev)} /> */}
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
                    <span style={{ flex: "0 0 auto" }}>Total: {total} sucursales</span>
                ),
            }}
            scroll={{ x: 800 }}
        />
    );
};
