"use client";

import { Card } from "antd";
import { LinkOutlined } from "@ant-design/icons";

export const EmptyLinkState: React.FC = () => {
    return (
        <Card>
            <div
                style={{
                    textAlign: "center",
                    padding: "48px 24px",
                    color: "#8c8c8c",
                }}
            >
                <LinkOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
                <p style={{ fontSize: "16px", margin: 0 }}>
                    Selecciona una sede y un profesional para generar el link
                </p>
            </div>
        </Card>
    );
};
