"use client";

import { useState, useEffect } from "react";
import { Input, Button, Segmented, Flex, Space } from "antd";
import { SearchOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { useDebounce } from "@/hooks";

interface ServiceFiltersProps {
    onFiltersChange: (search: string, status: "active" | "inactive") => void;
    loading: boolean;
}

type StatusFilter = "active" | "inactive";

export const ServiceFilters = ({ onFiltersChange, loading }: ServiceFiltersProps) => {
    const [status, setStatus] = useState<StatusFilter>("active");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 700);

    useEffect(() => {
        onFiltersChange(debouncedSearch, status);
    }, [debouncedSearch, status]);

    const handleClearFilters = () => {
        setStatus("active");
        setSearch("");
    };

    return (
        <Flex vertical gap={16}>
            <Flex style={{ width: "100%" }}>
                <Segmented
                    block
                    value={status}
                    onChange={setStatus}
                    options={[
                        {
                            label: (
                                <div style={{ width: "100%", textAlign: "center" }}>Activos</div>
                            ),
                            value: "active",
                        },
                        {
                            label: (
                                <div style={{ width: "100%", textAlign: "center" }}>Eliminados</div>
                            ),
                            value: "inactive",
                        },
                    ]}
                    style={{ width: "100%" }}
                />
            </Flex>

            <Flex justify="space-between" align="center" gap={16}>
                <Input
                    placeholder="Buscar servicios..."
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                    style={{ width: "16rem" }}
                />
                <Space>
                    <Button icon={<FilterOutlined />} type="primary" disabled>
                        Más filtros 
                    </Button>
                    <Button icon={<ClearOutlined />} onClick={handleClearFilters} loading={loading}>
                        Borrar filtros
                    </Button>
                </Space>
            </Flex>
        </Flex>
    );
};
