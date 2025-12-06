"use client";
import { ReactNode } from "react";
import { Typography, Space, Flex, Card } from "antd";

const { Title, Paragraph } = Typography;

type PageContainerProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
};

export const PageContainer = ({ title, description, actions, children }: PageContainerProps) => {
    return (
        <Space orientation="vertical" size={8} style={{ width: "100%" }}>
            <Card>
                <Flex justify="space-between" align="center" wrap gap="small">
                    <div>
                        <Title level={2} style={{ margin: 0 }}>
                            {title}
                        </Title>
                        {description && (
                            <Paragraph type="secondary" style={{ margin: 0 }}>
                                {description}
                            </Paragraph>
                        )}
                    </div>
                    {actions}
                </Flex>
            </Card>

            {children}
        </Space>
    );
};
