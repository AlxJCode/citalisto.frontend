"use client";

import { useState, useCallback } from "react";
import { Service, ServiceApi } from "../types/service.types";
import { message } from "antd";
import {
    createServiceApi,
    deleteServiceApi,
    getServiceApi,
    getServicesApi,
    ServiceFilters,
    updateServiceApi,
} from "../services/service.api";
import { toCamelCase } from "@/lib/utils/case";

export const useServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [service, setService] = useState<Service | null>(null);
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

    const fetchService = async (id: number | string) => {
        setLoading(true);
        const result = await getServiceApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setService(result.data);
        setLoading(false);
    };

    const createService = async (formData: Partial<ServiceApi> | FormData): Promise<{
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

    const updateService = async (id: number | string, formData: Partial<ServiceApi> | FormData): Promise<{
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

    const deleteService = async (id: number | string) => {
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
        service,
        loading,
        count,
        fetchServices,
        fetchService,
        createService,
        updateService,
        deleteService,
    };
};
