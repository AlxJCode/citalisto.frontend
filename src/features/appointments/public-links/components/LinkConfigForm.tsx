"use client";

import { Card, Form, Select, Button, FormInstance } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { Branch } from "@/features/organizations/branch/types/branch.types";
import { Professional } from "@/features/professionals/professional/types/professional.types";

interface LinkConfigFormProps {
    form: FormInstance;
    branches: Branch[];
    professionals: Professional[];
    loadingBranches: boolean;
    loadingProfessionals: boolean;
    selectedBranch: number | null;
    onBranchChange: (branchId: number) => void;
    onFinish: (values: { branch: number; professional: number }) => void;
}

export const LinkConfigForm: React.FC<LinkConfigFormProps> = ({
    form,
    branches,
    professionals,
    loadingBranches,
    loadingProfessionals,
    selectedBranch,
    onBranchChange,
    onFinish,
}) => {
    return (
        <Card title="Configuración">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
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
                        onChange={onBranchChange}
                        showSearch={{ optionFilterProp: "children" }}
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
                        showSearch={{ optionFilterProp: "children" }}
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
    );
};
