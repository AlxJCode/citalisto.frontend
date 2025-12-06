"use client";

import { useState, useCallback } from "react";
import {
    ProfessionalWeeklyAvailability,
    ProfessionalWeeklyAvailabilityApi,
} from "../types/professional-weekly-availability.types";
import { message } from "antd";
import {
    createWeeklyAvailabilityApi,
    deleteWeeklyAvailabilityApi,
    getWeeklyAvailabilitiesApi,
    WeeklyAvailabilityFilters,
    updateWeeklyAvailabilityApi,
} from "../services/weekly-availability.api";
import { toCamelCase } from "@/lib/utils/case";

export const useWeeklyAvailability = () => {
    const [weeklyAvailabilities, setWeeklyAvailabilities] = useState<
        ProfessionalWeeklyAvailability[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchWeeklyAvailabilities = useCallback(async (filters: WeeklyAvailabilityFilters) => {
        setLoading(true);
        const result = await getWeeklyAvailabilitiesApi(filters);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setWeeklyAvailabilities(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const createWeeklyAvailability = async (
        formData: Partial<ProfessionalWeeklyAvailabilityApi>
    ): Promise<{
        success: boolean;
        newObject?: ProfessionalWeeklyAvailability;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createWeeklyAvailabilityApi(formData);

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

    const updateWeeklyAvailability = async (
        id: number,
        formData: Partial<ProfessionalWeeklyAvailabilityApi>
    ): Promise<{
        success: boolean;
        updatedObject?: ProfessionalWeeklyAvailability;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await updateWeeklyAvailabilityApi(id, formData);

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
            updatedObject: result.data,
            status: result.status,
        };
    };

    const deleteWeeklyAvailability = async (id: number) => {
        const result = await deleteWeeklyAvailabilityApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            return false;
        }

        //message.success(result.message);
        return true;
    };

    return {
        weeklyAvailabilities,
        loading,
        count,
        fetchWeeklyAvailabilities,
        createWeeklyAvailability,
        updateWeeklyAvailability,
        deleteWeeklyAvailability,
    };
};
