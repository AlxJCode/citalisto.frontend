import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import { ServiceApi, Service } from "../types/service.types";

// Mapper de ServiceApi (snake_case) a Service (camelCase)
export const mapService = (apiService: ServiceApi): Service => ({
    id: apiService.id,
    isActive: apiService.is_active,
    business: apiService.business,
    branch: apiService.branch,
    name: apiService.name,
    isPublic: apiService.is_public,
    description: apiService.description,
    price: `${parseFloat(apiService.price)}`,
    durationMinutes: apiService.duration_minutes,
    created: apiService.created,
    modified: apiService.modified,
    createdBy: apiService.created_by,
    updatedBy: apiService.updated_by,
});

// Mapper de Service (camelCase) a ServiceApi (snake_case)
export const mapServiceToApi = (service: Partial<Service>): Partial<ServiceApi> => {
    const mapped: Partial<ServiceApi> = {
        name: service.name,
        description: service.description,
        price: service.price,
        is_public: service.isPublic,
        duration_minutes: service.durationMinutes,
        business: service.business,
    };

    // Solo incluir branch si está presente (requerido solo al crear)
    if (service.branch !== undefined) {
        mapped.branch = service.branch;
    }

    return mapped;
};

export interface ServiceFilters {
    page?: number;
    search?: string;
    min_price?: number;
    name?: string;
    max_price?: number;
    per_page?: number;
    business?: number;
    is_active?: boolean;
}

// Tipo de retorno para GET lista
export interface GetServicesSuccess {
    success: true;
    data: Service[];
    count: number;
    message: string;
    status: number;
}

export interface GetServicesError {
    success: false;
    message: string;
    status: number;
}

export type GetServicesResult = GetServicesSuccess | GetServicesError;

export const getServicesApi = async (
    filters?: ServiceFilters
): Promise<GetServicesResult> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.name) params.append("name__icontains", filters.name);
    if (filters?.min_price) params.append("min_price", filters.min_price.toString());
    if (filters?.max_price) params.append("max_price", filters.max_price.toString());
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());
    if (filters?.business) params.append("business", filters.business.toString());
    if (filters?.is_active !== undefined)
        params.append("is_active", filters.is_active ? "1" : "0");

    const res = await apiRequest<ServiceApi[]>(() =>
        apiClient.get(`/api/v1/services-catalog/services/?${params.toString()}`)
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
        data: res.data?.map(mapService) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para GET por id
export interface GetServiceSuccess {
    success: true;
    data: Service;
    message: string;
    status: number;
}

export interface GetServiceError {
    success: false;
    message: string;
    status: number;
}

export type GetServiceResult = GetServiceSuccess | GetServiceError;

export const getServiceApi = async (
    id: number
): Promise<GetServiceResult> => {
    const res = await apiRequest<ServiceApi>(() =>
        apiClient.get(`/api/v1/services-catalog/services/${id}/`)
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
        data: mapService(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para CREATE
export interface CreateServiceSuccess {
    success: true;
    data: Service;
    message: string;
    status: number;
}

export interface CreateServiceError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type CreateServiceResult = CreateServiceSuccess | CreateServiceError;

export const createServiceApi = async (
    formData: Partial<ServiceApi>
): Promise<CreateServiceResult> => {
    const res = await apiRequest<ServiceApi>(() =>
        apiClient.post("/api/v1/services-catalog/services/create/", formData)
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
        data: mapService(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para UPDATE
export interface UpdateServiceSuccess {
    success: true;
    data: Service;
    message: string;
    status: number;
}

export interface UpdateServiceError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type UpdateServiceResult = UpdateServiceSuccess | UpdateServiceError;

export const updateServiceApi = async (
    id: number,
    formData: Partial<ServiceApi>
): Promise<UpdateServiceResult> => {
    const res = await apiRequest<ServiceApi>(() =>
        apiClient.patch(`/api/v1/services-catalog/services/${id}/`, formData)
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
        data: mapService(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para DELETE
export interface DeleteServiceSuccess {
    success: true;
    message: string;
    status: number;
}

export interface DeleteServiceError {
    success: false;
    message: string;
    status: number;
}

export type DeleteServiceResult = DeleteServiceSuccess | DeleteServiceError;

export const deleteServiceApi = async (
    id: number
): Promise<DeleteServiceResult> => {
    const res = await apiRequest<void>(() =>
        apiClient.delete(`/api/v1/services-catalog/services/${id}/`)
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
