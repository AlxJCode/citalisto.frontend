"use client";

import { useState, useEffect } from "react";
import { Form, Row, Col, message } from "antd";
import { PageContainer } from "@/components/layout/PageContainer";
import { useBranches } from "@/features/organizations/branch/hooks/useBranches";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import { useSession } from "@/providers/SessionProvider";
import { LinkConfigForm } from "@/features/appointments/public-links/components/LinkConfigForm";
import { GeneratedLinkDisplay } from "@/features/appointments/public-links/components/GeneratedLinkDisplay";
import { EmptyLinkState } from "@/features/appointments/public-links/components/EmptyLinkState";

export default function PublicLinksPage() {
    const [form] = Form.useForm();
    const [generatedLink, setGeneratedLink] = useState<string>("");
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

    const { branches, loading: loadingBranches, fetchBranches } = useBranches();
    const { professionals, loading: loadingProfessionals, fetchProfessionals } = useProfessionals();
    const userSession = useSession();

    useEffect(() => {
        fetchBranches({ is_active: true });
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            fetchProfessionals({ is_active: true, branch: selectedBranch });
        }
    }, [selectedBranch]);

    const handleGenerateLink = (values: { branch: number; professional: number }) => {
        const businessSlug = userSession?.businessModel?.slug;
        const link = `${window.location.origin}/book/${businessSlug}/?branch=${values.branch}&professional=${values.professional}`;
        setGeneratedLink(link);
        message.success("Link generado correctamente");
    };

    const handleBranchChange = (branchId: number) => {
        setSelectedBranch(branchId);
        form.setFieldValue("professional", undefined);
        setGeneratedLink("");
    };

    return (
        <PageContainer
            title="Generador de Links Públicos"
            description="Crea enlaces personalizados para que tus clientes puedan reservar citas directamente"
        >
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={10}>
                    <LinkConfigForm
                        form={form}
                        branches={branches}
                        professionals={professionals}
                        loadingBranches={loadingBranches}
                        loadingProfessionals={loadingProfessionals}
                        selectedBranch={selectedBranch}
                        onBranchChange={handleBranchChange}
                        onFinish={handleGenerateLink}
                    />
                </Col>

                <Col xs={24} lg={14}>
                    {generatedLink ? (
                        <GeneratedLinkDisplay link={generatedLink} />
                    ) : (
                        <EmptyLinkState />
                    )}
                </Col>
            </Row>
        </PageContainer>
    );
}
