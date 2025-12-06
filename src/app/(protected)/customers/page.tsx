"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { CustomersList } from "@/features/customers/customer/components/CustomersList";
import { AddCustomerModal } from "@/features/customers/customer/components/AddCustomerModal";
import { useCustomers } from "@/features/customers/customer/hooks/useCustomers";
import { Card, Space, Flex, Divider } from "antd";
import { useEffect, useState } from "react";
import { CustomerFilters } from "@/features/customers/customer/components/CustomerFilters";
import { CustomerFiltersProps } from "@/features/customers/customer/services/customer.api";

const CustomersPage = () => {
    const [page, setPage] = useState(1);
    const [changes, setChanges] = useState(false);
    const [filters, setFilters] = useState<CustomerFiltersProps>({ search: "" });
    const { loading, customers, count, fetchCustomers } = useCustomers();

    useEffect(() => {
        fetchCustomers({ page, ...filters });
    }, [page, changes, filters]);

    const handleFiltersChange = (search: string, status: "active" | "inactive") => {
        setFilters({ search, is_active: status === "active" });
        setPage(1);
    };

    return (
        <PageContainer
            title="Gestionar Clientes"
            description="Administra los clientes de tu negocio"
            actions={
                <Space wrap>
                    <AddCustomerModal onSuccess={() => setChanges((prev) => !prev)} />
                </Space>
            }
        >
            <Flex vertical gap={8}>
                <Card>
                    <CustomerFilters onFiltersChange={handleFiltersChange} />
                    <Divider size="middle" />
                    <CustomersList
                        count={count}
                        page={page}
                        setPage={setPage}
                        setChanges={setChanges}
                        loading={loading}
                        dataSource={customers}
                    />
                </Card>
            </Flex>
        </PageContainer>
    );
};

export default CustomersPage;
