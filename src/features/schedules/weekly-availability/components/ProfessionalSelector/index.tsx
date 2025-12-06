"use client";

import { useState, useEffect } from "react";
import { Card, Select, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import { useDebounce } from "@/hooks/useDebounce";
import { Professional } from "@/features/professionals/professional/types/professional.types";

const { Text } = Typography;

interface ProfessionalSelectorProps {
    value?: number;
    onChange: (professionalId: number | undefined, professional?: Professional) => void;
}

export const ProfessionalSelector = ({ value, onChange }: ProfessionalSelectorProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);
    const { professionals, loading, fetchProfessionals } = useProfessionals();

    useEffect(() => {
        fetchProfessionals({
            page: 1,
            is_active: true,
            name: debouncedSearch || undefined,
        });
    }, [debouncedSearch, fetchProfessionals]);

    const handleChange = (professionalId: number) => {
        const selectedProfessional = professionals.find((p) => p.id === professionalId);
        onChange(professionalId, selectedProfessional);
    };

    const handleClear = () => {
        onChange(undefined, undefined);
    };

    return (
        <Card>
            <Space orientation="vertical" style={{ width: "100%" }} size="small">
                <Text strong>Seleccionar Profesional</Text>
                <Select
                    showSearch={{onSearch: setSearchTerm, filterOption: false}}
                    placeholder="Buscar profesional..."
                    value={value}
                    onChange={handleChange}
                    onClear={handleClear}
                    loading={loading}
                    allowClear
                    style={{ width: "100%" }}
                    size="middle"
                    suffixIcon={<UserOutlined />}
                    notFoundContent={loading ? "Cargando..." : "No se encontraron profesionales"}
                >
                    {professionals.map((professional) => (
                        <Select.Option key={professional.id} value={professional.id}>
                            {professional.name} {professional.lastName}
                        </Select.Option>
                    ))}
                </Select>
            </Space>
        </Card>
    );
};
