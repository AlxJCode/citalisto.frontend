"use client";

import { useState, useCallback } from "react";
import { Professional, ProfessionalApi } from "../types/professional.types";
import { message } from "antd";
import {
    createProfessionalApi,
    deleteProfessionalApi,
    getProfessionalsApi,
    ProfessionalFilters,
    updateProfessionalApi,
} from "../services/professional.api";
import { toCamelCase } from "@/lib/utils/case";

export const useProfessionals = () => {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchProfessionals = useCallback(async (filters: ProfessionalFilters) => {
        setLoading(true);
        const result = await getProfessionalsApi(filters);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setProfessionals(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const createProfessional = async (formData: Partial<ProfessionalApi>): Promise<{
        success: boolean;
        newObject?: Professional;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createProfessionalApi(formData as ProfessionalApi);

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

    const updateProfessional = async (id: number, formData: Partial<ProfessionalApi>): Promise<{
        success: boolean;
        updatedObject?: Professional;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await updateProfessionalApi(id, formData);

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

    const deleteProfessional = async (id: number) => {
        const result = await deleteProfessionalApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            return false;
        }

        message.success(result.message);
        return true;
    };

    return {
        professionals,
        loading,
        count,
        fetchProfessionals,
        createProfessional,
        updateProfessional,
        deleteProfessional,
    };
};
