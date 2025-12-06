"use client";

import { useState, useCallback } from "react";
import { Business, BusinessApi } from "../types/business.types";
import { message } from "antd";
import {
    createBusinessApi,
    deleteBusinessApi,
    getBusinessesApi,
    BusinessFilters,
    updateBusinessApi,
} from "../services/business.api";
import { toCamelCase } from "@/lib/utils/case";

export const useBusinesses = () => {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchBusinesses = useCallback(async (filters: BusinessFilters) => {
        setLoading(true);
        const result = await getBusinessesApi(filters);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setBusinesses(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const createBusiness = async (formData: Partial<BusinessApi>): Promise<{
        success: boolean;
        newObject?: Business;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createBusinessApi(formData);

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

    const updateBusiness = async (id: number, formData: Partial<BusinessApi>): Promise<{
        success: boolean;
        updatedObject?: Business;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await updateBusinessApi(id, formData);

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

    const deleteBusiness = async (id: number) => {
        const result = await deleteBusinessApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            return false;
        }

        message.success(result.message);
        return true;
    };

    return {
        businesses,
        loading,
        count,
        fetchBusinesses,
        createBusiness,
        updateBusiness,
        deleteBusiness,
    };
};
