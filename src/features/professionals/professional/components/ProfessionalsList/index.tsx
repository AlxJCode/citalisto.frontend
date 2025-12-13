"use client";

import { Table, Space, TableColumnsType, Tag } from "antd";
import { Professional } from "../../types/professional.types";
import { Dispatch, SetStateAction } from "react";
import { EditProfessionalModal } from "../EditProfessionalModal";
import { DeleteProfessionalModal } from "../DeleteProfessionalModal";

interface ProfessionalsListProps {
    dataSource: Professional[];
    loading: boolean;
    setChanges: Dispatch<SetStateAction<boolean>>;
    setPage: Dispatch<SetStateAction<number>>;
    page: number;
    count: number;
}

export const ProfessionalsList = ({
    dataSource,
    loading,
    setChanges,
    setPage,
    page,
    count,
}: ProfessionalsListProps) => {
    const columns: TableColumnsType<Professional> = [
        {
            title: "#",
            key: "index",
            width: 60,
            render: (_, __, index) => (page - 1) * 10 + index + 1,
        },
        {
            title: "Nombre Completo",
            key: "fullName",
            ellipsis: true,
            render: (_, record) => `${record.name} ${record.lastName || ""}`.trim(),
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
        /* {
            title: "Servicios",
            dataIndex: "servicesModel",
            key: "services",
            width: 200,
            render: (services) =>
                services && services.length > 0 ? (
                    <Space wrap size="small">
                        {services.map((service: any) => (
                            <Tag key={service.id} color="blue">
                                {service.name}
                            </Tag>
                        ))}
                    </Space>
                ) : (
                    "-"
                ),
        }, */
        {
            title: "Acciones",
            key: "actions",
            width: 120,
            fixed: "right",
            render: (_, record) => (
                <Space size="small">
                    <EditProfessionalModal
                        professional={record}
                        onSuccess={() => setChanges((prev) => !prev)}
                    />
                    {/* <DeleteProfessionalModal
                        professional={record}
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
            rowClassName={(record) => (!record.isActive ? "table-row-inactive" : "")}
            pagination={{
                pageSize: 10,
                total: count,
                current: page,
                showSizeChanger: false,
                onChange: (page) => setPage(page),
                showTotal: (total) => (
                    <span style={{ flex: "0 0 auto" }}>Total: {total} profesionales</span>
                ),
            }}
            scroll={{ x: 1100 }}
        />
    );
};
