import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import { BusinessApi, Business } from "../types/business.types";
import { mapCategory } from "../../category/services/category.api";
import { mapUser } from "@/features/users/user/services/user.api";

export const mapBusiness = (apiBusiness: BusinessApi): Business => ({
    id: apiBusiness.id,
    name: apiBusiness.name,
    category: apiBusiness.category,
    categoryModel: apiBusiness.category_model ? mapCategory(apiBusiness.category_model) : null,
    logo: apiBusiness.logo,
    phone: apiBusiness.phone,
    timezone: apiBusiness.timezone,
    slug: apiBusiness.slug,
    isActive: apiBusiness.is_active,
    owner: apiBusiness.owner,
    whatsappMonthlyLimit: apiBusiness.whatsapp_monthly_limit,
    ownerModel: apiBusiness.owner_model ? mapUser(apiBusiness.owner_model) : null,
    created: apiBusiness.created,
    modified: apiBusiness.modified,
    createdBy: apiBusiness.created_by,
    updatedBy: apiBusiness.updated_by,
});

export interface BusinessFilters {
    page?: number;
    search?: string;
    category?: number;
    owner?: number;
}

// Tipo de retorno para GET lista
export interface GetBusinessesSuccess {
    success: true;
    data: Business[];
    count: number;
    message: string;
    status: number;
}

export interface GetBusinessesError {
    success: false;
    message: string;
    status: number;
}

export type GetBusinessesResult = GetBusinessesSuccess | GetBusinessesError;

export const getBusinessesApi = async (filters?: BusinessFilters): Promise<GetBusinessesResult> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category.toString());
    if (filters?.owner) params.append("owner", filters.owner.toString());

    const res = await apiRequest<BusinessApi[]>(() =>
        apiClient.get(`/api/v1/organizations/business/?${params.toString()}`)
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
        data: res.data?.map(mapBusiness) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para GET por id
export interface GetBusinessSuccess {
    success: true;
    data: Business;
    message: string;
    status: number;
}

export interface GetBusinessError {
    success: false;
    message: string;
    status: number;
}

export type GetBusinessResult = GetBusinessSuccess | GetBusinessError;

export const getBusinessApi = async (id: number): Promise<GetBusinessResult> => {
    const res = await apiRequest<BusinessApi>(() =>
        apiClient.get(`/api/v1/organizations/business/${id}/`)
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
        data: mapBusiness(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para CREATE
export interface CreateBusinessSuccess {
    success: true;
    data: Business;
    message: string;
    status: number;
}

export interface CreateBusinessError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type CreateBusinessResult = CreateBusinessSuccess | CreateBusinessError;

export const createBusinessApi = async (formData: Partial<BusinessApi>): Promise<CreateBusinessResult> => {
    const res = await apiRequest<BusinessApi>(() =>
        apiClient.post("/api/v1/organizations/business/", formData)
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
        data: mapBusiness(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para UPDATE
export interface UpdateBusinessSuccess {
    success: true;
    data: Business;
    message: string;
    status: number;
}

export interface UpdateBusinessError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type UpdateBusinessResult = UpdateBusinessSuccess | UpdateBusinessError;

export const updateBusinessApi = async (
    id: number,
    formData: Partial<BusinessApi>
): Promise<UpdateBusinessResult> => {
    const res = await apiRequest<BusinessApi>(() =>
        apiClient.patch(`/api/v1/organizations/business/${id}/`, formData)
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
        data: mapBusiness(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para DELETE
export interface DeleteBusinessSuccess {
    success: true;
    message: string;
    status: number;
}

export interface DeleteBusinessError {
    success: false;
    message: string;
    status: number;
}

export type DeleteBusinessResult = DeleteBusinessSuccess | DeleteBusinessError;

export const deleteBusinessApi = async (id: number): Promise<DeleteBusinessResult> => {
    const res = await apiRequest<void>(() =>
        apiClient.delete(`/api/v1/organizations/business/${id}/`)
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
