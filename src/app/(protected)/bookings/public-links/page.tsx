"use client";

import { useState, useEffect } from "react";
import { Card, Form, Select, Button, Input, Alert, Space } from "antd";
import { LinkOutlined, CopyOutlined } from "@ant-design/icons";
import { PageContainer } from "@/components/layout/PageContainer";
import { useBranches } from "@/features/organizations/branch/hooks/useBranches";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import { useSession } from "@/providers/SessionProvider";

export default function PublicLinksPage() {
    const [form] = Form.useForm();
    const [generatedLink, setGeneratedLink] = useState<string>("");
    const [showSuccess, setShowSuccess] = useState(false);
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
        // TODO: Obtener business.slug desde el contexto/session cuando esté disponible
        console.log("userSession", userSession);
        const businessSlug = userSession?.businessModel?.slug; // Placeholder
        const link = `${window.location.origin}/book/${businessSlug}/?branch=${values.branch}&professional=${values.professional}`;
        setGeneratedLink(link);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(generatedLink);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error("Error al copiar:", error);
        }
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
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleGenerateLink}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Sede"
                        name="branch"
                        rules={[{ required: true, message: "Selecciona una sede" }]}
                    >
                        <Select
                            placeholder="Selecciona una sede"
                            loading={loadingBranches}
                            onChange={handleBranchChange}
                            showSearch
                            optionFilterProp="children"
                        >
                            {branches.map((branch) => (
                                <Select.Option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Profesional"
                        name="professional"
                        rules={[{ required: true, message: "Selecciona un profesional" }]}
                    >
                        <Select
                            placeholder="Selecciona un profesional"
                            loading={loadingProfessionals}
                            disabled={!selectedBranch}
                            showSearch
                            optionFilterProp="children"
                        >
                            {professionals.map((professional) => (
                                <Select.Option key={professional.id} value={professional.id}>
                                    {professional.name} {professional.lastName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<LinkOutlined />}
                            size="large"
                            block
                        >
                            Generar Link
                        </Button>
                    </Form.Item>
                </Form>

                {generatedLink && (
                    <div className="mt-6">
                        <Space orientation="vertical" className="w-full" size="middle">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Link generado:
                                </label>
                                <Space.Compact style={{width: "100%"}}>
                                    <Input
                                        value={generatedLink}
                                        readOnly
                                        style={{ width: "calc(100% - 100px)" }}
                                    />
                                    <Button
                                        type="primary"
                                        icon={<CopyOutlined />}
                                        onClick={handleCopyLink}
                                    >
                                        Copiar
                                    </Button>
                                </Space.Compact>
                            </div>

                            {showSuccess && (
                                <Alert
                                    title="¡Link copiado al portapapeles!"
                                    type="success"
                                    showIcon
                                    closable
                                />
                            )}
                        </Space>
                    </div>
                )}
            </Card>
        </PageContainer>
    );
}
