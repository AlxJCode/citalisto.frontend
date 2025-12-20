"use client";

import { useState, useEffect } from "react";
import { Card, Form, Select, Button, Input, Space, Row, Col, QRCode, message } from "antd";
import { LinkOutlined, CopyOutlined, DownloadOutlined, ExportOutlined } from "@ant-design/icons";
import { PageContainer } from "@/components/layout/PageContainer";
import { useBranches } from "@/features/organizations/branch/hooks/useBranches";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import { useSession } from "@/providers/SessionProvider";

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

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(generatedLink);
            message.success("Link copiado al portapapeles");
        } catch (error) {
            message.error("Error al copiar el link");
        }
    };

    const handleOpenLink = () => {
        window.open(generatedLink, "_blank", "noopener,noreferrer");
    };

    const handleDownloadQR = () => {
        const canvas = document.getElementById("qr-code")?.querySelector<HTMLCanvasElement>("canvas");
        if (canvas) {
            const url = canvas.toDataURL();
            const a = document.createElement("a");
            a.download = "qr-code-reserva.png";
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            message.success("QR descargado correctamente");
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
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={10}>
                    <Card title="Configuración">
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
                                    showSearch={{optionFilterProp: "children"}}
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
                                    showSearch={{optionFilterProp: "children"}}
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
                    </Card>
                </Col>

                <Col xs={24} lg={14}>
                    {generatedLink ? (
                        <Card title="Link y QR Generado">
                            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                                <div id="qr-code" style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
                                    <QRCode value={generatedLink} size={200} />
                                </div>

                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                                        Link de reserva:
                                    </label>
                                    <Space.Compact style={{ width: "100%" }}>
                                        <Input value={generatedLink} readOnly />
                                        <Button
                                            icon={<ExportOutlined />}
                                            onClick={handleOpenLink}
                                            title="Abrir en nueva pestaña"
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

                                <Button
                                    type="default"
                                    icon={<DownloadOutlined />}
                                    onClick={handleDownloadQR}
                                    block
                                    size="large"
                                >
                                    Descargar QR
                                </Button>
                            </Space>
                        </Card>
                    ) : (
                        <Card>
                            <div style={{ textAlign: "center", padding: "48px 24px", color: "#8c8c8c" }}>
                                <LinkOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
                                <p style={{ fontSize: "16px", margin: 0 }}>
                                    Selecciona una sede y un profesional para generar el link
                                </p>
                            </div>
                        </Card>
                    )}
                </Col>
            </Row>
        </PageContainer>
    );
}
