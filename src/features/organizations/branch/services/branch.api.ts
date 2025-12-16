import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import { BranchApi, Branch } from "../types/branch.types";
import { mapBusiness } from "../../business/services/business.api";

export const mapBranch = (apiBranch: BranchApi): Branch => ({
    id: apiBranch.id,
    business: apiBranch.business,
    businessModel: apiBranch.business_model ? mapBusiness(apiBranch.business_model) : null,
    name: apiBranch.name,
    address: apiBranch.address,
    phone: apiBranch.phone,
    isActive: apiBranch.is_active,
    created: apiBranch.created,
    modified: apiBranch.modified,
    createdBy: apiBranch.created_by,
    updatedBy: apiBranch.updated_by,
});

export const mapBranchToApi = (branch: Partial<Branch>): Partial<BranchApi> => {
    return {
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        business: branch.business,
    };
};

export interface BranchFiltersProps {
    page?: number;
    per_page?: number;
    is_active?: boolean;
    name?: string;
    business?: number;
}

// Tipo de retorno para GET lista
export interface GetBranchesSuccess {
    success: true;
    data: Branch[];
    count: number;
    message: string;
    status: number;
}

export interface GetBranchesError {
    success: false;
    message: string;
    status: number;
}

export type GetBranchesResult = GetBranchesSuccess | GetBranchesError;

export const getBranchesApi = async (
    filters?: BranchFiltersProps
): Promise<GetBranchesResult> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());
    if (filters?.name) params.append("name__icontains", filters.name);
    if (filters?.business) params.append("business", filters.business.toString());
    if (filters?.is_active !== undefined)
        params.append("is_active", filters.is_active ? "1" : "0");

    const res = await apiRequest<BranchApi[]>(() =>
        apiClient.get(`/api/v1/organizations/branches/?${params.toString()}`)
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
        data: res.data?.map(mapBranch) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para GET por id
export interface GetBranchSuccess {
    success: true;
    data: Branch;
    message: string;
    status: number;
}

export interface GetBranchError {
    success: false;
    message: string;
    status: number;
}

export type GetBranchResult = GetBranchSuccess | GetBranchError;

export const getBranchApi = async (
    id: number
): Promise<GetBranchResult> => {
    const res = await apiRequest<BranchApi>(() =>
        apiClient.get(`/api/v1/organizations/branches/${id}/`)
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
        data: mapBranch(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para CREATE
export interface CreateBranchSuccess {
    success: true;
    data: Branch;
    message: string;
    status: number;
}

export interface CreateBranchError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type CreateBranchResult = CreateBranchSuccess | CreateBranchError;

export const createBranchApi = async (
    formData: Partial<BranchApi>
): Promise<CreateBranchResult> => {
    const res = await apiRequest<BranchApi>(() =>
        apiClient.post("/api/v1/organizations/branches/", formData)
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
        data: mapBranch(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para UPDATE
export interface UpdateBranchSuccess {
    success: true;
    data: Branch;
    message: string;
    status: number;
}

export interface UpdateBranchError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type UpdateBranchResult = UpdateBranchSuccess | UpdateBranchError;

export const updateBranchApi = async (
    id: number,
    formData: Partial<BranchApi>
): Promise<UpdateBranchResult> => {
    const res = await apiRequest<BranchApi>(() =>
        apiClient.patch(`/api/v1/organizations/branches/${id}/`, formData)
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
        data: mapBranch(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para DELETE
export interface DeleteBranchSuccess {
    success: true;
    message: string;
    status: number;
}

export interface DeleteBranchError {
    success: false;
    message: string;
    status: number;
}

export type DeleteBranchResult = DeleteBranchSuccess | DeleteBranchError;

export const deleteBranchApi = async (
    id: number
): Promise<DeleteBranchResult> => {
    const res = await apiRequest<void>(() =>
        apiClient.delete(`/api/v1/organizations/branches/${id}/`)
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
