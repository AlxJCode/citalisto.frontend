"use client";

import { useState, useCallback } from "react";
import { User, UserApi } from "../types/user.api";
import { message } from "antd";
import {
    createUserApi,
    deleteUserApi,
    getUserApi,
    getUsersApi,
    UserFilters,
    updateUserApi,
} from "../services/user.api";
import { toCamelCase } from "@/lib/utils/case";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchUsers = useCallback(async (filters: UserFilters) => {
        setLoading(true);
        const result = await getUsersApi(filters);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setUsers(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const fetchUser = async (id: number | string) => {
        setLoading(true);
        const result = await getUserApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setUser(result.data);
        setLoading(false);
    };

    const createUser = async (formData: Partial<UserApi>): Promise<{
        success: boolean;
        newObject?: User;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createUserApi(formData);

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

    const updateUser = async (id: number | string, formData: Partial<UserApi>): Promise<{
        success: boolean;
        updatedObject?: User;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await updateUserApi(id, formData);

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

    const deleteUser = async (id: number | string) => {
        const result = await deleteUserApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            return false;
        }

        message.success(result.message);
        return true;
    };

    return {
        users,
        user,
        loading,
        count,
        fetchUsers,
        fetchUser,
        createUser,
        updateUser,
        deleteUser,
    };
};
