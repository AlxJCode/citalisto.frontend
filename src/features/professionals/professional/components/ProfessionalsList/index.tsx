"use client";

import { Table, Space, TableColumnsType, Tag, Avatar, Image } from "antd";
import { Professional } from "../../types/professional.types";
import { Dispatch, SetStateAction } from "react";
import { EditProfessionalModal } from "../EditProfessionalModal";
import { DeleteProfessionalModal } from "../DeleteProfessionalModal";
import { UserOutlined } from "@ant-design/icons";

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
            render: (_, record) => (
                <div style={{display:"flex", gap: "0.5rem", alignItems: "center"}}>
                    {record.profilePhoto ? (
                        <Image src={record.profilePhoto} alt="Avatar" width={36} height={36} 
                            style={{objectFit:"cover", borderRadius: "50%"}}
                        />
                    ): (
                        <Avatar size={36} icon={<UserOutlined />} />
                    )}
                    <div>
                        {`${record.name} ${record.lastName || ""}`.trim()}
                    </div>
                </div>
            )
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
            width: 80,
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
