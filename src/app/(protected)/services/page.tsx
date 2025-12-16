"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { AddServiceModal } from "@/features/services-catalog/service/components/AddServiceModal";
import { ServicesList } from "@/features/services-catalog/service/components/ServicesList";
import { ServiceFilters } from "@/features/services-catalog/service/components/ServiceFilters";
import { useServices } from "@/features/services-catalog/service/hooks/useServices";
import { Card, Space, Flex, Divider } from "antd";
import { useEffect, useState } from "react";

const ServicesPage = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [changes, setChanges] = useState(false);
    const [filters, setFilters] = useState({ name: "", is_active: true });
    const { loading, services, count, fetchServices } = useServices();

    useEffect(() => {
        fetchServices({ page, per_page: pageSize, ...filters });
    }, [page, pageSize, changes, filters]);

    const handleFiltersChange = (name: string, status: "active" | "inactive") => {
        setFilters({ name, is_active: status === "active" });
        setPage(1);
    };

    return (
        <PageContainer
            title="Gestionar Servicios"
            description="Administra los servicios de tu consultorio"
            actions={
                <Space wrap>
                    <AddServiceModal onSuccess={() => setChanges((prev) => !prev)} />
                </Space>
            }
        >
            <Flex vertical gap={8}>
                <Card>
                    <ServiceFilters onFiltersChange={handleFiltersChange} loading={loading} />
                    <Divider size="middle" />
                    <ServicesList
                        count={count}
                        page={page}
                        setPage={setPage}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        setChanges={setChanges}
                        loading={loading}
                        dataSource={services}
                    />
                </Card>
            </Flex>
        </PageContainer>
    );
};

export default ServicesPage;
