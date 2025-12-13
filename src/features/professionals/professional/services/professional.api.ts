import { apiClient } from "@/lib/api/client";
import { apiRequest, NormalizedResult } from "@/lib/api/apiRequest";
import { ProfessionalApi, Professional } from "../types/professional.types";
import { mapBranch } from "@/features/organizations/branch/services/branch.api";
import { mapService } from "@/features/services-catalog/service/services/service.api";
import axios from "axios";
import { normalizeText } from "@/lib/utils/text";

export const mapProfessional = (apiProfessional: ProfessionalApi): Professional => ({
    id: apiProfessional.id,
    branch: apiProfessional.branch,
    branchModel: apiProfessional.branch_model ? mapBranch(apiProfessional.branch_model) : null,
    name: apiProfessional.name,
    lastName: apiProfessional.last_name,
    business: apiProfessional.business,
    isActive: apiProfessional.is_active,
    email: apiProfessional.email,
    phone: apiProfessional.phone,
    description: apiProfessional.description,
    services: apiProfessional.services,
    servicesModel: apiProfessional.services_model
        ? apiProfessional.services_model.map(mapService)
        : null,
    created: apiProfessional.created,
    modified: apiProfessional.modified,
    createdBy: apiProfessional.created_by,
    updatedBy: apiProfessional.updated_by,
});

export const mapProfessionalToApi = (professional: Partial<Professional>): Partial<ProfessionalApi> => {
    return {
        name: professional.name,
        last_name: professional.lastName,
        business: professional.business,
        email: professional.email,
        phone: professional.phone,
        description: professional.description,
        services: professional.services,
    };
};

export interface ProfessionalFilters {
    page?: number;
    search?: string;
    name?: string;
    name__icontains?: string;
    is_active?: boolean;
    branch?: number;
}

// Tipo de retorno para GET lista
export interface GetProfessionalsSuccess {
    success: true;
    data: Professional[];
    count: number;
    message: string;
    status: number;
}

export interface GetProfessionalsError {
    success: false;
    message: string;
    status: number;
}

export type GetProfessionalsResult = GetProfessionalsSuccess | GetProfessionalsError;

export const getProfessionalsApi = async (
    filters?: ProfessionalFilters
): Promise<GetProfessionalsResult> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.name) params.append("name__icontains", filters.name);
    if (filters?.name__icontains) params.append("name__icontains", filters.name__icontains);
    if (filters?.branch) params.append("branch", filters.branch.toString());
    if (filters?.is_active !== undefined)
        params.append("is_active", filters.is_active ? "1" : "0");

    const res = await apiRequest<ProfessionalApi[]>(() =>
        apiClient.get(`/api/v1/professionals/professionals/?${params.toString()}`)
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
        data: res.data?.map(mapProfessional) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para GET por id
export interface GetProfessionalSuccess {
    success: true;
    data: Professional;
    message: string;
    status: number;
}

export interface GetProfessionalError {
    success: false;
    message: string;
    status: number;
}

export type GetProfessionalResult = GetProfessionalSuccess | GetProfessionalError;

export const getProfessionalApi = async (
    id: number
): Promise<GetProfessionalResult> => {
    const res = await apiRequest<ProfessionalApi>(() =>
        apiClient.get(`/api/v1/professionals/professionals/${id}/`)
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
        data: mapProfessional(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para CREATE
export interface CreateProfessionalSuccess {
    success: true;
    data: Professional;
    message: string;
    status: number;
}

export interface CreateProfessionalError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type CreateProfessionalResult = CreateProfessionalSuccess | CreateProfessionalError;

export const createProfessionalApi = async (
    formData: Partial<ProfessionalApi>
): Promise<CreateProfessionalResult> => {
    const res = await apiRequest<ProfessionalApi>(() =>
        apiClient.post("/api/v1/professionals/professionals/create/", formData)
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
        data: mapProfessional(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para UPDATE
export interface UpdateProfessionalSuccess {
    success: true;
    data: Professional;
    message: string;
    status: number;
}

export interface UpdateProfessionalError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type UpdateProfessionalResult = UpdateProfessionalSuccess | UpdateProfessionalError;

export const updateProfessionalApi = async (
    id: number,
    formData: Partial<ProfessionalApi>
): Promise<UpdateProfessionalResult> => {
    const res = await apiRequest<ProfessionalApi>(() =>
        apiClient.patch(`/api/v1/professionals/professionals/${id}/`, formData)
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
        data: mapProfessional(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para DELETE
export interface DeleteProfessionalSuccess {
    success: true;
    message: string;
    status: number;
}

export interface DeleteProfessionalError {
    success: false;
    message: string;
    status: number;
}

export type DeleteProfessionalResult = DeleteProfessionalSuccess | DeleteProfessionalError;

export const deleteProfessionalApi = async (
    id: number
): Promise<DeleteProfessionalResult> => {
    const res = await apiRequest<void>(() =>
        apiClient.delete(`/api/v1/professionals/professionals/${id}/`)
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
