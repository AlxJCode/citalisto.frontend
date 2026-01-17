"use client";

import { Table, Button, Space, TableColumnsType, Tag, Image, Avatar } from "antd";
import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined, SmileOutlined } from "@ant-design/icons";
import { Service } from "../../types/service.types";
import { EditServiceModal } from "../EditServiceModal";
import { DeleteServiceModal } from "../DeleteServiceModal";
import { Dispatch, SetStateAction } from "react";

interface ServicesListProps {
    dataSource: Service[];
    loading: boolean;
    setChanges: Dispatch<SetStateAction<boolean>>;
    setPage: Dispatch<SetStateAction<number>>;
    page: number;
    pageSize: number;
    setPageSize: Dispatch<SetStateAction<number>>;
    count: number;
}

export const ServicesList = ({
    dataSource,
    loading,
    setChanges,
    setPage,
    page,
    pageSize,
    setPageSize,
    count,
}: ServicesListProps) => {

    const handleSuccess = () => {
        setChanges((prev) => !prev);
    };

    const columns: TableColumnsType<Service> = [
        {
            title: "#",
            key: "index",
            width: 40,
            render: (_, __, index) => (page - 1) * pageSize + index + 1,
        },
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
            render: (_,record) => (
                <div style={{display:"flex", gap: "0.5rem", alignItems: "center"}}>
                    {record.image ? (
                        <div style={{width:"32px", height: "32px"}}>
                            <Image src={record.image} alt="Avatar" width={32} height={32} 
                                style={{objectFit:"cover", borderRadius: "50%"}}
                            />
                        </div>
                    ): (
                        <div style={{width:"32px", height: "32px"}}>
                            <Avatar size={32} icon={<SmileOutlined />} />
                        </div>
                    )}
                    <div>
                        {`${record.name}`.trim()}
                    </div>
                </div>
            )
        },
        {
            title: "Descripción",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
            render: (text) => text || "-",
        },
        {
            title: "Precio",
            dataIndex: "price",
            key: "price",
            width: 120,
            render: (price) => `S/.${price}`,
        },
        {
            title: "Duración",
            dataIndex: "durationMinutes",
            key: "durationMinutes",
            width: 100,
            render: (minutes) => `${minutes} min`,
        },
        {
            title: "Visible para cliente",
            dataIndex: "isPublic",
            key: "isPublic",
            width: 100,
            render: (_, record) => record.isPublic? (
                <Tag color="success" icon={<EyeOutlined/>} variant="solid">Visible</Tag>
            ) : (
                <Tag color="default" variant="solid" icon={<EyeInvisibleOutlined />}>Oculto</Tag>
            )
        },
        {
            title: "Acciones",
            key: "actions",
            width: 100,
            render: (_, record) => (
                <Space size="small">
                    {record.isActive ?(
                        <Space>
                            <EditServiceModal service={record} size="middle" onSuccess={handleSuccess} />
                            <DeleteServiceModal service={record} onSuccess={handleSuccess} />
                        </Space>
                    ) : null}
                    
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
            size="small"
            rowClassName={(record) => (!record.isActive ? "table-row-inactive" : "")}
            pagination={{
                pageSize: pageSize,
                pageSizeOptions: [10, 20, 50, 100],
                total: count,
                current: page,
                showSizeChanger: true,
                onChange: (page, newPageSize) => {
                    setPage(page);
                    if (newPageSize !== pageSize) {
                        setPageSize(newPageSize);
                    }
                },
                showTotal: (total) => `Total: ${total} servicios`,
            }}
            scroll={{ x: 800 }}
        />
    );
};
