"use client";

import { Card, Space, Input, Button, Image, message } from "antd";
import { CopyOutlined, DownloadOutlined, ExportOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

interface GeneratedLinkDisplayProps {
    link: string;
}

export const GeneratedLinkDisplay: React.FC<GeneratedLinkDisplayProps> = ({ link }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

    useEffect(() => {
        QRCode.toDataURL(link, {
            width: 200,
            margin: 2,
            errorCorrectionLevel: 'M',
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }).then(setQrCodeUrl);
    }, [link]);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(link);
            message.success("Link copiado al portapapeles");
        } catch (error) {
            message.error("Error al copiar el link");
        }
    };

    const handleOpenLink = () => {
        window.open(link, "_blank", "noopener,noreferrer");
    };

    const handleDownloadQR = () => {
        if (qrCodeUrl) {
            const a = document.createElement("a");
            a.download = "qr-code-reserva.png";
            a.href = qrCodeUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            message.success("QR descargado correctamente");
        }
    };

    return (
        <Card title="Link y QR Generado">
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "24px 0",
                    }}
                >
                    {qrCodeUrl && (
                        <Image
                            src={qrCodeUrl}
                            alt="QR Code para reservas"
                            width={200}
                            height={200}
                            preview={{
                                mask: "Ver QR",
                            }}
                        />
                    )}
                </div>

                <div>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "8px",
                            fontWeight: 500,
                        }}
                    >
                        Link de reserva:
                    </label>
                    <Space.Compact style={{ width: "100%" }}>
                        <Input value={link} readOnly />
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
    );
};
