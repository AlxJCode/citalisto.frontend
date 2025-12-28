"use client";

import { Card, Button, Tag, Table, Divider } from 'antd';
import { CreditCardOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface Invoice {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
}

const BillingPage = () => {
    const invoices: Invoice[] = [
        {
            id: 'INV-001',
            date: '2025-01-01',
            amount: 99.00,
            status: 'paid',
            description: 'Plan Professional - Enero 2025',
        },
        {
            id: 'INV-002',
            date: '2024-12-01',
            amount: 99.00,
            status: 'paid',
            description: 'Plan Professional - Diciembre 2024',
        },
        {
            id: 'INV-003',
            date: '2024-11-01',
            amount: 99.00,
            status: 'paid',
            description: 'Plan Professional - Noviembre 2024',
        },
    ];

    const columns: ColumnsType<Invoice> = [
        {
            title: 'ID Factura',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Descripción',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Monto',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => `S/.${amount.toFixed(2)}`,
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusConfig = {
                    paid: { color: 'green', text: 'Pagado' },
                    pending: { color: 'orange', text: 'Pendiente' },
                    failed: { color: 'red', text: 'Fallido' },
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            },
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: () => (
                <Button type="link" icon={<DownloadOutlined />} size="small">
                    Descargar
                </Button>
            ),
        },
    ];

    return (
        <div>
                <h2 className="text-xl font-semibold mb-1">Facturación</h2>
                <p className="text-gray-500 mb-6">Administra tu suscripción y métodos de pago</p>

                <Divider />

                {/* Current Plan */}
                <Card className="mb-6" bordered={false}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Plan Actual</h3>
                            <div className="flex items-center gap-3">
                                <Tag color="blue" className="text-base px-3 py-1">Plan Professional</Tag>
                                <span className="text-2xl font-bold">S/.99.00</span>
                                <span className="text-gray-500">/ mes</span>
                            </div>
                        </div>
                        <Button type="primary">Cambiar plan</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div>
                            <div className="text-gray-500 text-sm">Próximo pago</div>
                            <div className="font-semibold">01 Febrero 2025</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm">WhatsApp mensajes</div>
                            <div className="font-semibold">1,000 / mes</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-sm">Profesionales</div>
                            <div className="font-semibold">Ilimitados</div>
                        </div>
                    </div>
                </Card>

                {/* Payment Method */}
                <Card className="mb-6" bordered={false}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Método de Pago</h3>
                            <div className="flex items-center gap-3">
                                <CreditCardOutlined className="text-2xl" />
                                <div>
                                    <div className="font-medium">Visa terminada en 4242</div>
                                    <div className="text-sm text-gray-500">Vence 12/2026</div>
                                </div>
                            </div>
                        </div>
                        <Button>Actualizar</Button>
                    </div>
                </Card>

                {/* Invoices */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Historial de Facturas</h3>
                    <Table
                        columns={columns}
                        dataSource={invoices}
                        rowKey="id"
                        pagination={false}
                    />
                </div>
        </div>
    );
};

export default BillingPage;
