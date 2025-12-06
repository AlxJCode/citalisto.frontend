"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { BranchesList } from "@/features/organizations/branch/components/BranchesList";
import { AddBranchModal } from "@/features/organizations/branch/components/AddBranchModal";
import { useBranches } from "@/features/organizations/branch/hooks/useBranches";
import { Card, Space, Flex, Divider } from "antd";
import { useEffect, useState } from "react";
import { BranchFiltersProps } from "@/features/organizations/branch/services/branch.api";
import { BranchFilters } from "@/features/organizations/branch/components/BranchFilters";

const BranchesPage = () => {
    const [page, setPage] = useState(1);
    const [changes, setChanges] = useState(false);
    const [filters, setFilters] = useState<BranchFiltersProps>({ name: "" });
    const { loading, branches, count, fetchBranches } = useBranches();

    useEffect(() => {
        fetchBranches({ page, ...filters });
    }, [page, changes, filters]);

    const handleFiltersChange = (name: string, status: "active" | "inactive") => {
        setFilters({ name, is_active: status === "active" });
        setPage(1);
    };

    return (
        <PageContainer
            title="Gestionar Sucursales"
            description="Administra las sucursales de tu negocio"
            actions={
                <Space wrap>
                    <AddBranchModal onSuccess={() => setChanges((prev) => !prev)} />
                </Space>
            }
        >
            <Flex vertical gap={8}>
                <Card>
                    <BranchFilters onFiltersChange={handleFiltersChange} />
                    <Divider size="middle" />
                    <BranchesList
                        count={count}
                        page={page}
                        setPage={setPage}
                        setChanges={setChanges}
                        loading={loading}
                        dataSource={branches}
                    />
                </Card>
            </Flex>
        </PageContainer>
    );
};

export default BranchesPage;
