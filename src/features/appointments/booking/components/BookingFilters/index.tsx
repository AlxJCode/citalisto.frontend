"use client";

import { useState, useEffect, Dispatch, SetStateAction, useEffectEvent } from "react";
import { Input, Button, Segmented, Flex, Space, DatePicker, Select } from "antd";
import { SearchOutlined, ClearOutlined, CalendarOutlined } from "@ant-design/icons";
import { useDebounce } from "@/hooks";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import dayjs, { Dayjs } from "dayjs";
import { on } from "events";
import { normalizeText } from "@/lib/utils/text";
import { useCustomers } from "@/features/customers/customer/hooks/useCustomers";

const { RangePicker } = DatePicker;

interface BookingFiltersProps {
    onFiltersChange: (filters: Record<string, any>) => void;
    setPage: Dispatch<SetStateAction<number>>;
}

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled" | "completed";

export const BookingFilters = ({ onFiltersChange, setPage }: BookingFiltersProps) => {
    const [status, setStatus] = useState<StatusFilter>("all");
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([dayjs(), dayjs()]);
    const [selectedProfessional, setSelectedProfessional] = useState<number | undefined>();
    const [selectedCustomer, setSelectedCustomer] = useState<number | undefined>();
    const debouncedSearch = useDebounce(search, 700);
    const [searchCustomer, setSearchCustomer] = useState("");
    const debouncedSearchCustomer = useDebounce(searchCustomer, 700);
    const { professionals, fetchProfessionals, loading: professionalsLoading } = useProfessionals();
    const { customers, fetchCustomers, loading: customersLoading } = useCustomers();

    useEffect(() => {
        fetchProfessionals({ is_active: true, name__icontains: debouncedSearch });
    }, [fetchProfessionals, debouncedSearch]);

    useEffect(() => {
        fetchCustomers({ is_active: true, name__icontains: debouncedSearchCustomer });
    }, [fetchCustomers, debouncedSearchCustomer]);

    useEffect(() => {
        onFiltersChange(
            {filter: {
                status: status === "all" ? undefined : status,
                date__range: dateRange ? [dayjs(dateRange[0]).format("YYYY-MM-DD"), dayjs(dateRange[1]).format("YYYY-MM-DD")] : undefined,
                professional: selectedProfessional
            }}
        );
    }, [ status, dateRange, selectedProfessional]);

    const handleClearFilters = () => {
        setPage(1);
        setStatus("all");
        setSearch("");
        setSearchCustomer("");
        setDateRange([dayjs(), dayjs()]);
        setSelectedCustomer(undefined);
        setSelectedProfessional(undefined);
    };

    return (
        <Flex vertical gap={8}>
            <Flex style={{ width: "100%" }}>
                <Segmented
                    block
                    value={status}
                    onChange={setStatus}
                    options={[
                        {
                            label: <div style={{ width: "100%", textAlign: "center" }}>Todas</div>,
                            value: "all",
                        },
                        {
                            label: <div style={{ width: "100%", textAlign: "center" }}>Pendientes</div>,
                            value: "pending",
                        },
                        {
                            label: <div style={{ width: "100%", textAlign: "center" }}>Confirmadas</div>,
                            value: "confirmed",
                        },
                        {
                            label: <div style={{ width: "100%", textAlign: "center" }}>Canceladas</div>,
                            value: "cancelled",
                        },
                        {
                            label: <div style={{ width: "100%", textAlign: "center" }}>Completadas</div>,
                            value: "completed",
                        },
                    ]}
                    style={{ width: "100%" }}
                />
            </Flex>

            <Flex justify="space-between" align="center" gap={16} wrap="wrap">
                <Space wrap>
                    {/* <Input
                        placeholder="Buscar citas..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                        style={{ width: "16rem" }}
                    /> */}
                    <Select
                        placeholder="Cliente"
                        value={selectedCustomer}
                        onChange={setSelectedCustomer}
                        allowClear
                        loading={customersLoading}
                        showSearch={{optionFilterProp: "children", onSearch: (value) => {
                            setSearchCustomer(value);
                        }}}
                        style={{ width: "14rem" }}
                    >
                        {customers.map((cust) => (
                            <Select.Option key={cust.id} value={cust.id!}>
                                {cust.name} {cust.lastName}
                            </Select.Option>
                        ))}
                    </Select>
                    <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        format="DD/MM/YYYY"
                        placeholder={["Fecha inicio", "Fecha fin"]}
                        style={{ width: "16rem" }}
                    />
                    <Select
                        placeholder="Profesional"
                        value={selectedProfessional}
                        onChange={setSelectedProfessional}
                        loading={professionalsLoading}
                        allowClear
                        showSearch={{optionFilterProp: "children", onSearch: (value) => {
                            setSearch(value);
                        }}}
                        style={{ width: "14rem" }}
                    >
                        {professionals.map((prof) => (
                            <Select.Option key={prof.id} value={prof.id!}>
                                {prof.name} {prof.lastName}
                            </Select.Option>
                        ))}
                    </Select>
                </Space>
                <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                    Borrar filtros
                </Button>
            </Flex>
        </Flex>
    );
};
