"use client";

import { useState, useCallback } from "react";
import { Customer, CustomerApi } from "../types/customer.types";
import { message } from "antd";
import {
    createCustomerApi,
    deleteCustomerApi,
    getCustomerApi,
    updateCustomerApi,
    CustomerFiltersProps,
    getCustomersApi,
} from "../services/customer.api";
import { toCamelCase } from "@/lib/utils/case";

export const useCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchCustomers = useCallback(async (filters: CustomerFiltersProps) => {
        setLoading(true);
        const result = await getCustomersApi(filters);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setCustomers(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const fetchCustomer = async (id: number | string) => {
        setLoading(true);
        const result = await getCustomerApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setCustomer(result.data);
        setLoading(false);
    };

    const createCustomer = async (formData: Partial<CustomerApi>): Promise<{
        success: boolean;
        newObject?: Customer;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createCustomerApi(formData);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            // Si hay detalles de validación, mostrarlos
            const details = result.details ? toCamelCase(result.details): null;
            return {
                success: result.success,
                errorFields: details,
                status: result.status,
            };
        }
        message.success(result.message);
        return {
            success: result.success,
            newObject: result.data,
            status: result.status,
        };
    };

    const updateCustomer = async (id: number | string, formData: Partial<CustomerApi>): Promise<{
        success: boolean;
        updatedObject?: Customer;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await updateCustomerApi(id, formData);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            // Si hay detalles de validación, mostrarlos
            const details = result.details ? toCamelCase(result.details): null;
            return {
                success: result.success,
                errorFields: details,
                status: result.status,
            };
        }

        message.success(result.message);
        return {
            success: result.success,
            updatedObject: result.data,
            status: result.status,
        };
    };

    const deleteCustomer = async (id: number | string) => {
        const result = await deleteCustomerApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            return false;
        }

        message.success(result.message);
        return true;
    };

    return {
        customers,
        customer,
        loading,
        count,
        fetchCustomers,
        fetchCustomer,
        createCustomer,
        updateCustomer,
        deleteCustomer,
    };
};
