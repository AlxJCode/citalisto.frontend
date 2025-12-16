"use client";

import { useState, useEffect } from "react";
import { Button, Segmented, Flex, Space, DatePicker, Select } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useDebounce } from "@/hooks";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";
import dayjs, { Dayjs } from "dayjs";
import { useCustomers } from "@/features/customers/customer/hooks/useCustomers";

const { RangePicker } = DatePicker;

interface BookingFiltersProps {
    onFiltersChange: (filters: Record<string, any>) => void;
}

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled" | "completed";

const TODAY = dayjs();

export const BookingFilters = ({ onFiltersChange }: BookingFiltersProps) => {
    const [status, setStatus] = useState<StatusFilter>("all");
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([TODAY, TODAY]);
    const [selectedProfessional, setSelectedProfessional] = useState<number | undefined>();
    const [selectedCustomer, setSelectedCustomer] = useState<number | undefined>();
    const [searchProfessional, setSearchProfessional] = useState("");
    const [searchCustomer, setSearchCustomer] = useState("");

    const debouncedSearchProfessional = useDebounce(searchProfessional, 700);
    const debouncedSearchCustomer = useDebounce(searchCustomer, 700);

    const { professionals, fetchProfessionals, loading: professionalsLoading } = useProfessionals();
    const { customers, fetchCustomers, loading: customersLoading } = useCustomers();

    useEffect(() => {
        fetchProfessionals({ is_active: true, name__icontains: debouncedSearchProfessional });
    }, [debouncedSearchProfessional]);

    useEffect(() => {
        fetchCustomers({ is_active: true, name__icontains: debouncedSearchCustomer });
    }, [debouncedSearchCustomer]);

    useEffect(() => {
        onFiltersChange({
            filter: {
                status: status === "all" ? undefined : status,
                date__range: dateRange
                    ? [dateRange[0]!.format("YYYY-MM-DD"), dateRange[1]!.format("YYYY-MM-DD")]
                    : undefined,
                professional: selectedProfessional,
                customer: selectedCustomer,
            }
        });
    }, [status, dateRange, selectedProfessional, selectedCustomer]);

    const clearFilters = () => {
        setStatus("all");
        setDateRange([TODAY, TODAY]);
        setSelectedProfessional(undefined);
        setSelectedCustomer(undefined);
        setSearchProfessional("");
        setSearchCustomer("");
    };

    return (
        <Flex vertical gap={8}>
            <Segmented
                block
                value={status}
                onChange={setStatus}
                options={[
                    { label: "Todas", value: "all" },
                    { label: "Pendientes", value: "pending" },
                    { label: "Confirmadas", value: "confirmed" },
                    { label: "Canceladas", value: "cancelled" },
                    { label: "Completadas", value: "completed" },
                ]}
            />

            <Flex justify="space-between" align="center" gap={16} wrap="wrap">
                <Space wrap>
                    <Select
                        placeholder="Cliente"
                        value={selectedCustomer}
                        onChange={setSelectedCustomer}
                        allowClear
                        loading={customersLoading}
                        showSearch
                        onSearch={setSearchCustomer}
                        filterOption={false}
                        style={{ width: "14rem" }}
                    >
                        {customers.map((customer) => (
                            <Select.Option key={customer.id} value={customer.id!}>
                                {customer.name} {customer.lastName}
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
                        allowClear
                        loading={professionalsLoading}
                        showSearch
                        onSearch={setSearchProfessional}
                        filterOption={false}
                        style={{ width: "14rem" }}
                    >
                        {professionals.map((prof) => (
                            <Select.Option key={prof.id} value={prof.id!}>
                                {prof.name} {prof.lastName}
                            </Select.Option>
                        ))}
                    </Select>
                </Space>

                <Button icon={<ClearOutlined />} onClick={clearFilters}>
                    Borrar filtros
                </Button>
            </Flex>
        </Flex>
    );
};
