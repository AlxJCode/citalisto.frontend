import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import { ChangePasswordRequest } from "../types/password.types";

export interface ChangePasswordSuccess {
    success: true;
    message: string;
    status: number;
}

export interface ChangePasswordError {
    success: false;
    message: string;
    status: number;
    details?: any;
}

export type ChangePasswordResult = ChangePasswordSuccess | ChangePasswordError;

export async function changePasswordApi(
    data: ChangePasswordRequest
): Promise<ChangePasswordResult> {
    const res = await apiRequest<null>(() =>
        apiClient.post("/api/v1/users/users/change-password/", data)
    );

    if (!res.success) {
        return {
            success: false,
            message: res.message,
            status: res.status,
            details: res.details,
        };
    }

    return {
        success: true,
        message: res.message,
        status: res.status,
    };
}
