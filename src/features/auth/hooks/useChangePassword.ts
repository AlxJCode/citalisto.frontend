"use client";

import { useState } from "react";
import { message } from "antd";
import { changePasswordApi } from "../services/password.api";
import { ChangePasswordRequest } from "../types/password.types";
import { toCamelCase } from "@/lib/utils/case";

export const useChangePassword = () => {
    const [loading, setLoading] = useState(false);

    const changePassword = async (
        data: ChangePasswordRequest
    ): Promise<{
        success: boolean;
        errorFields?: Record<string, string[]>;
    }> => {
        setLoading(true);
        const result = await changePasswordApi(data);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);

            if (result.details) {
                const camelDetails = toCamelCase(result.details);
                const normalizedDetails: Record<string, string[]> = {};

                Object.entries(camelDetails).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        normalizedDetails[key] = value;
                    } else if (typeof value === "string") {
                        normalizedDetails[key] = [value];
                    }
                });

                setLoading(false);
                return {
                    success: false,
                    errorFields: normalizedDetails,
                };
            }

            setLoading(false);
            return { success: false };
        }

        message.success(result.message);
        setLoading(false);
        return { success: true };
    };

    return {
        changePassword,
        loading,
    };
};
