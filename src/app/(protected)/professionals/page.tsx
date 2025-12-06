"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { ProfessionalsList } from "@/features/professionals/professional/components/ProfessionalsList";
import { AddProfessionalModal } from "@/features/professionals/professional/components/AddProfessionalModal";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import { Card, Space, Flex, Divider } from "antd";
import { useEffect, useState } from "react";
import { ProfessionalFilters as ProfessionalFiltersType } from "@/features/professionals/professional/services/professional.api";
import { ProfessionalFilters } from "@/features/professionals/professional/components/ProfessionalFilters";

const ProfessionalsPage = () => {
    const [page, setPage] = useState(1);
    const [changes, setChanges] = useState(false);
    const [filters, setFilters] = useState<ProfessionalFiltersType>({ search: "" });
    const { loading, professionals, count, fetchProfessionals } = useProfessionals();

    useEffect(() => {
        fetchProfessionals({ page, ...filters });
    }, [page, changes, filters]);

    const handleFiltersChange = (search: string, status: "active" | "inactive") => {
        setFilters({ search, is_active: status === "active" });
        setPage(1);
    };

    return (
        <PageContainer
            title="Gestionar Profesionales"
            description="Administra los profesionales de tu negocio"
            actions={
                <Space wrap>
                    <AddProfessionalModal onSuccess={() => setChanges((prev) => !prev)} />
                </Space>
            }
        >
            <Flex vertical gap={8}>
                <Card>
                    <ProfessionalFilters onFiltersChange={handleFiltersChange} />
                    <Divider size="middle" />
                    <ProfessionalsList
                        count={count}
                        page={page}
                        setPage={setPage}
                        setChanges={setChanges}
                        loading={loading}
                        dataSource={professionals}
                    />
                </Card>
            </Flex>
        </PageContainer>
    );
};

export default ProfessionalsPage;
