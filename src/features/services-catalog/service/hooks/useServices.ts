// TODO: Implementar useServices hook
"use client";

import { useState, useCallback } from "react";
import { Service, ServiceApi } from "../types/service.types";
import { message } from "antd";
import {
    createServiceApi,
    deleteServiceApi,
    getServicesApi,
    ServiceFilters,
    updateServiceApi,
} from "../services/service.api";
import { toCamelCase } from "@/lib/utils/case";

export const useServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchServices = useCallback(async (filters: ServiceFilters) => {
        setLoading(true);
        const result = await getServicesApi(filters);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setServices(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const createService = async (formData: Partial<ServiceApi>): Promise<{
        success: boolean;
        newObject?: Service;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createServiceApi(formData);

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

    const updateService = async (id: number, formData: Partial<ServiceApi>): Promise<{
        success: boolean;
        updatedObject?: Service;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await updateServiceApi(id, formData);

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

    const deleteService = async (id: number) => {
        const result = await deleteServiceApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            return false;
        }

        message.success(result.message);
        return true;
    };

    return {
        services,
        loading,
        count,
        fetchServices,
        createService,
        updateService,
        deleteService,
    };
};
