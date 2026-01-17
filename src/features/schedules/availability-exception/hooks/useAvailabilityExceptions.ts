"use client";

import { useState, useCallback } from "react";
import {
    ProfessionalAvailabilityException,
    ProfessionalAvailabilityExceptionApi,
} from "../types/professional-availability-exception.types";
import { message } from "antd";
import {
    createAvailabilityExceptionApi,
    deleteAvailabilityExceptionApi,
    getAvailabilityExceptionApi,
    getAvailabilityExceptionsApi,
    AvailabilityExceptionFilters,
    updateAvailabilityExceptionApi,
} from "../services/availability-exception.api";
import { toCamelCase } from "@/lib/utils/case";

export const useAvailabilityExceptions = () => {
    const [availabilityExceptions, setAvailabilityExceptions] = useState<
        ProfessionalAvailabilityException[]
    >([]);
    const [availabilityException, setAvailabilityException] = useState<ProfessionalAvailabilityException | null>(null);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchAvailabilityExceptions = useCallback(async (filters: AvailabilityExceptionFilters) => {
        setLoading(true);
        const result = await getAvailabilityExceptionsApi(filters);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setAvailabilityExceptions(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const fetchAvailabilityException = async (id: number | string) => {
        setLoading(true);
        const result = await getAvailabilityExceptionApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setAvailabilityException(result.data);
        setLoading(false);
    };

    const createAvailabilityException = async (
        formData: Partial<ProfessionalAvailabilityExceptionApi>
    ): Promise<{
        success: boolean;
        newObject?: ProfessionalAvailabilityException;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createAvailabilityExceptionApi(formData);

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
        //message.success(result.message);
        return {
            success: result.success,
            newObject: result.data,
            status: result.status,
        };
    };

    const updateAvailabilityException = async (
        id: number | string,
        formData: Partial<ProfessionalAvailabilityExceptionApi>
    ): Promise<{
        success: boolean;
        updatedObject?: ProfessionalAvailabilityException;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await updateAvailabilityExceptionApi(id, formData);

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

    const deleteAvailabilityException = async (id: number | string) => {
        const result = await deleteAvailabilityExceptionApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            return false;
        }

        //message.success(result.message);
        return true;
    };

    return {
        availabilityExceptions,
        availabilityException,
        loading,
        count,
        fetchAvailabilityExceptions,
        fetchAvailabilityException,
        createAvailabilityException,
        updateAvailabilityException,
        deleteAvailabilityException,
    };
};
