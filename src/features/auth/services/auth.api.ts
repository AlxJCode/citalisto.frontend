// Auth API service - using Axios client

import { apiClient } from "@/lib/api/client";
import { ApiResponse } from "@/types/base";
import { SessionUser, AuthTokens } from "@/lib/auth/types";

// API response type (snake_case from backend)
interface SessionUserApi {
    id: number;
    username: string;
    email: string;
    dni?: string | null;
    first_name: string;
    last_name: string;
    mother_last_name?: string;
    role: string;
    role_display: string;
    business?: number | null;
    business_model?: any | null;
    profile_picture?: string | null;
    is_active: boolean;
    is_staff: boolean;
    password_change_required: boolean;
    last_password_change?: string | null;
    created: string;
    modified: string;
}

// Map API response to camelCase SessionUser
function mapSessionUser(apiUser: SessionUserApi): SessionUser {
    return {
        id: apiUser.id,
        username: apiUser.username,
        email: apiUser.email,
        dni: apiUser.dni,
        firstName: apiUser.first_name,
        lastName: apiUser.last_name,
        motherLastName: apiUser.mother_last_name,
        role: apiUser.role as any,
        roleDisplay: apiUser.role_display,
        business: apiUser.business,
        businessModel: apiUser.business_model ? {
            id: apiUser.business_model.id,
            name: apiUser.business_model.name,
            category: apiUser.business_model.category,
            categoryModel: apiUser.business_model.category_model,
            logo: apiUser.business_model.logo,
            slug: apiUser.business_model.slug,
            whatsappMonthlyLimit: apiUser.business_model.whatsapp_monthly_limit,
            created: apiUser.business_model.created,
            isActive: apiUser.business_model.is_active,
            modified: apiUser.business_model.modified,
            phone: apiUser.business_model.phone,
            timezone: apiUser.business_model.timezone,
            owner: apiUser.business_model.owner,
        } : null,
        profilePicture: apiUser.profile_picture,
        isActive: apiUser.is_active,
        isStaff: apiUser.is_staff,
        passwordChangeRequired: apiUser.password_change_required,
        lastPasswordChange: apiUser.last_password_change,
        created: apiUser.created,
        modified: apiUser.modified,
    };
}

export interface LoginCredentials {
    username: string; // Can be email or username
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    username: string;
    mother_last_name?: string;
    dni?: string;
}

/**
 * Login user - POST /api/v1/auth/token/
 * Returns ONLY tokens (access and refresh)
 */
export async function loginApi(credentials: LoginCredentials): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>("/api/v1/auth/token/", credentials);
    return data;
}

/**
 * Get current user info - GET /api/v1/auth/me/
 * Returns user information with ApiResponse wrapper, mapped to camelCase
 */
export async function getMeApi(accessToken: string): Promise<SessionUser> {
    const { data } = await apiClient.get<ApiResponse<SessionUserApi>>("/api/v1/auth/me/", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!data.success || !data.data) {
        throw new Error(data.message || "Error al obtener información del usuario");
    }

    // Map snake_case API response to camelCase SessionUser
    return mapSessionUser(data.data);
}

/**
 * Refresh access token - POST /api/v1/auth/token/refresh/
 * With ROTATE_REFRESH_TOKENS=True, returns both new access and refresh tokens
 */
export async function refreshTokenApi(refreshToken: string): Promise<AuthTokens> {
    const { data } = await apiClient.post<AuthTokens>("/api/v1/auth/token/refresh/", {
        refresh: refreshToken,
    });
    return data;
}

/**
 * Verify if token is valid - POST /api/v1/auth/token/verify/
 */
export async function verifyTokenApi(token: string): Promise<boolean> {
    try {
        await apiClient.post("/api/v1/auth/token/verify/", { token });
        return true;
    } catch {
        return false;
    }
}

/**
 * Register new user
 * Note: Endpoint might not exist in backend, check first
 */
export async function registerApi(data: RegisterData): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>("/api/v1/auth/register/", data);
    return response.data;
}
