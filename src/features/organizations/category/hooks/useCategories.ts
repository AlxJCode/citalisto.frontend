"use client";

import { useState, useCallback } from "react";
import { Category, CategoryApi } from "../types/category.types";
import { message } from "antd";
import {
    createCategoryApi,
    deleteCategoryApi,
    getCategoriesApi,
    getCategoryApi,
    CategoryFilters,
    updateCategoryApi,
} from "../services/category.api";
import { toCamelCase } from "@/lib/utils/case";

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchCategories = useCallback(async (filters: CategoryFilters) => {
        setLoading(true);
        const result = await getCategoriesApi(filters);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setCategories(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const fetchCategory = async (id: number | string) => {
        setLoading(true);
        const result = await getCategoryApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setCategory(result.data);
        setLoading(false);
    };

    const createCategory = async (formData: Partial<CategoryApi>): Promise<{
        success: boolean;
        newObject?: Category;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createCategoryApi(formData);

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

    const updateCategory = async (id: number | string, formData: Partial<CategoryApi>): Promise<{
        success: boolean;
        updatedObject?: Category;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await updateCategoryApi(id, formData);

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

    const deleteCategory = async (id: number | string) => {
        const result = await deleteCategoryApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            return false;
        }

        message.success(result.message);
        return true;
    };

    return {
        categories,
        category,
        loading,
        count,
        fetchCategories,
        fetchCategory,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};
