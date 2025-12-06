"use client";

import { useState, useCallback } from "react";
import { Branch, BranchApi } from "../types/branch.types";
import { message } from "antd";
import {
    BranchFiltersProps,
    createBranchApi,
    deleteBranchApi,
    getBranchesApi,
    updateBranchApi,
} from "../services/branch.api";
import { toCamelCase } from "@/lib/utils/case";

export const useBranches = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchBranches = useCallback(async (filters: BranchFiltersProps) => {
        setLoading(true);
        const result = await getBranchesApi(filters);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setBranches(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const createBranch = async (formData: Partial<BranchApi>): Promise<{
        success: boolean;
        newObject?: Branch;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createBranchApi(formData);

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

    const updateBranch = async (id: number, formData: Partial<BranchApi>): Promise<{
        success: boolean;
        updatedObject?: Branch;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await updateBranchApi(id, formData);

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

    const deleteBranch = async (id: number) => {
        const result = await deleteBranchApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            return false;
        }

        message.success(result.message);
        return true;
    };

    return {
        branches,
        loading,
        count,
        fetchBranches,
        createBranch,
        updateBranch,
        deleteBranch,
    };
};
