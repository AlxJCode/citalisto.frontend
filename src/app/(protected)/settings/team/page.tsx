"use client";

import { Table, Button, Tag, Avatar, Divider } from 'antd';
import { UserAddOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
}

const TeamPage = () => {
    const data: TeamMember[] = [
        {
            id: '1',
            name: 'Dr. Juan Pérez',
            email: 'juan.perez@example.com',
            role: 'Administrador',
            status: 'active',
        },
        {
            id: '2',
            name: 'Dra. María García',
            email: 'maria.garcia@example.com',
            role: 'Profesional',
            status: 'active',
        },
        {
            id: '3',
            name: 'Ana Rodríguez',
            email: 'ana.rodriguez@example.com',
            role: 'Recepcionista',
            status: 'active',
        },
    ];

    const columns: ColumnsType<TeamMember> = [
        {
            title: 'Miembro',
            key: 'member',
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-xs text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Rol',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'default'}>
                    {status === 'active' ? 'Activo' : 'Inactivo'}
                </Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: () => (
                <Button type="link" size="small">
                    Editar
                </Button>
            ),
        },
    ];

    return (
        <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-1">Equipo</h2>
                        <p className="text-gray-500">Administra los miembros de tu equipo</p>
                    </div>
                    <Button type="primary" icon={<UserAddOutlined />}>
                        Invitar miembro
                    </Button>
                </div>

                <Divider />

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={false}
                />
        </div>
    );
};

export default TeamPage;
