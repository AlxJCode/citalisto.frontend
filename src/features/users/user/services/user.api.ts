import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import { UserApi, User } from "../types/user.api";

export const mapUser = (apiUser: UserApi): User => ({
    id: apiUser.id,
    username: apiUser.username,
    dni: apiUser.dni,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    motherLastName: apiUser.mother_last_name,
    email: apiUser.email,
    phone: apiUser.phone,
    business: apiUser.business,
    businessModel: apiUser.business_model || null,
    role: apiUser.role,
    profilePicture: apiUser.profile_picture,
    lastPasswordChange: apiUser.last_password_change,
    passwordChangeRequired: apiUser.password_change_required,
    isActive: apiUser.is_active,
    isStaff: apiUser.is_staff,
    created: apiUser.created,
    modified: apiUser.modified,
    createdBy: apiUser.created_by,
    updatedBy: apiUser.updated_by,
});

export interface UserFilters {
    page?: number;
    search?: string;
    role?: string;
    business?: number;
    is_active?: boolean;
}

// Tipo de retorno para GET lista
export interface GetUsersSuccess {
    success: true;
    data: User[];
    count: number;
    message: string;
    status: number;
}

export interface GetUsersError {
    success: false;
    message: string;
    status: number;
}

export type GetUsersResult = GetUsersSuccess | GetUsersError;

export const getUsersApi = async (filters?: UserFilters): Promise<GetUsersResult> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.role) params.append("role", filters.role);
    if (filters?.business) params.append("business", filters.business.toString());
    if (filters?.is_active !== undefined)
        params.append("is_active", filters.is_active ? "1" : "0");

    const res = await apiRequest<UserApi[]>(() =>
        apiClient.get(`/api/v1/users/users/?${params.toString()}`)
    );

    if (!res.success) {
        return {
            success: false,
            message: res.message,
            status: res.status,
        };
    }

    return {
        success: true,
        data: res.data?.map(mapUser) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para GET por id
export interface GetUserSuccess {
    success: true;
    data: User;
    message: string;
    status: number;
}

export interface GetUserError {
    success: false;
    message: string;
    status: number;
}

export type GetUserResult = GetUserSuccess | GetUserError;

export const getUserApi = async (id: number | string): Promise<GetUserResult> => {
    const res = await apiRequest<UserApi>(() =>
        apiClient.get(`/api/v1/users/users/${id}/`)
    );

    if (!res.success) {
        return {
            success: false,
            message: res.message,
            status: res.status,
        };
    }

    return {
        success: true,
        data: mapUser(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para CREATE
export interface CreateUserSuccess {
    success: true;
    data: User;
    message: string;
    status: number;
}

export interface CreateUserError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type CreateUserResult = CreateUserSuccess | CreateUserError;

export const createUserApi = async (formData: Partial<UserApi>): Promise<CreateUserResult> => {
    const res = await apiRequest<UserApi>(() =>
        apiClient.post("/api/v1/users/users/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
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
        data: mapUser(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para UPDATE
export interface UpdateUserSuccess {
    success: true;
    data: User;
    message: string;
    status: number;
}

export interface UpdateUserError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type UpdateUserResult = UpdateUserSuccess | UpdateUserError;

export const updateUserApi = async (
    id: number | string,
    formData: Partial<UserApi>
): Promise<UpdateUserResult> => {
    const res = await apiRequest<UserApi>(() =>
        apiClient.patch(`/api/v1/users/users/${id}/`, formData,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
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
        data: mapUser(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para DELETE
export interface DeleteUserSuccess {
    success: true;
    message: string;
    status: number;
}

export interface DeleteUserError {
    success: false;
    message: string;
    status: number;
}

export type DeleteUserResult = DeleteUserSuccess | DeleteUserError;

export const deleteUserApi = async (id: number | string): Promise<DeleteUserResult> => {
    const res = await apiRequest<void>(() =>
        apiClient.delete(`/api/v1/users/users/${id}/`)
    );

    if (!res.success) {
        return {
            success: false,
            message: res.message,
            status: res.status,
        };
    }

    return {
        success: true,
        message: res.message,
        status: res.status,
    };
};
