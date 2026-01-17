import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import {
    ProfessionalAvailabilityExceptionApi,
    ProfessionalAvailabilityException,
} from "../types/professional-availability-exception.types";
import { mapProfessional } from "@/features/professionals/professional/services/professional.api";

// Simple mapper para Professional (solo id y full_name)

export const mapAvailabilityException = (
    apiException: ProfessionalAvailabilityExceptionApi
): ProfessionalAvailabilityException => ({
    id: apiException.id,
    professional: apiException.professional,
    professionalModel: apiException.professional_model ? mapProfessional(apiException.professional_model) : null,
    date: apiException.date,
    status: apiException.status,
    isActive: apiException.is_active,
    startTime: apiException.start_time,
    endTime: apiException.end_time,
    breakStartTime: apiException.break_start_time,
    breakEndTime: apiException.break_end_time,
    notes: apiException.notes,
    created: apiException.created,
    modified: apiException.modified,
    createdBy: apiException.created_by,
    updatedBy: apiException.updated_by,
});

export interface AvailabilityExceptionFilters {
    page?: number;
    search?: string;
    professional?: number;
    is_active?: boolean;
    date?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
}

// Tipo de retorno para GET lista
export interface GetAvailabilityExceptionsSuccess {
    success: true;
    data: ProfessionalAvailabilityException[];
    count: number;
    message: string;
    status: number;
}

export interface GetAvailabilityExceptionsError {
    success: false;
    message: string;
    status: number;
}

export type GetAvailabilityExceptionsResult = GetAvailabilityExceptionsSuccess | GetAvailabilityExceptionsError;

export const getAvailabilityExceptionsApi = async (
    filters?: AvailabilityExceptionFilters
): Promise<GetAvailabilityExceptionsResult> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.professional) params.append("professional", filters.professional.toString());
    if (filters?.date) params.append("date", filters.date);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.is_active !== undefined)
        params.append("is_active", filters.is_active ? "1" : "0");

    const res = await apiRequest<ProfessionalAvailabilityExceptionApi[]>(() =>
        apiClient.get(`/api/v1/schedules/availability-exceptions/?${params.toString()}`)
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
        data: res.data?.map(mapAvailabilityException) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para GET por id
export interface GetAvailabilityExceptionSuccess {
    success: true;
    data: ProfessionalAvailabilityException;
    message: string;
    status: number;
}

export interface GetAvailabilityExceptionError {
    success: false;
    message: string;
    status: number;
}

export type GetAvailabilityExceptionResult = GetAvailabilityExceptionSuccess | GetAvailabilityExceptionError;

export const getAvailabilityExceptionApi = async (
    id: number | string
): Promise<GetAvailabilityExceptionResult> => {
    const res = await apiRequest<ProfessionalAvailabilityExceptionApi>(() =>
        apiClient.get(`/api/v1/schedules/availability-exceptions/${id}/`)
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
        data: mapAvailabilityException(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para CREATE
export interface CreateAvailabilityExceptionSuccess {
    success: true;
    data: ProfessionalAvailabilityException;
    message: string;
    status: number;
}

export interface CreateAvailabilityExceptionError {
    success: false;
    message: string;
    status: number;
    details?: any;
}

export type CreateAvailabilityExceptionResult = CreateAvailabilityExceptionSuccess | CreateAvailabilityExceptionError;

export const createAvailabilityExceptionApi = async (
    formData: Partial<ProfessionalAvailabilityExceptionApi>
): Promise<CreateAvailabilityExceptionResult> => {
    const res = await apiRequest<ProfessionalAvailabilityExceptionApi>(() =>
        apiClient.post("/api/v1/schedules/availability-exceptions/create/", formData)
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
        data: mapAvailabilityException(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para UPDATE
export interface UpdateAvailabilityExceptionSuccess {
    success: true;
    data: ProfessionalAvailabilityException;
    message: string;
    status: number;
}

export interface UpdateAvailabilityExceptionError {
    success: false;
    message: string;
    status: number;
    details?: any;
}

export type UpdateAvailabilityExceptionResult = UpdateAvailabilityExceptionSuccess | UpdateAvailabilityExceptionError;

export const updateAvailabilityExceptionApi = async (
    id: number | string,
    formData: Partial<ProfessionalAvailabilityExceptionApi>
): Promise<UpdateAvailabilityExceptionResult> => {
    const res = await apiRequest<ProfessionalAvailabilityExceptionApi>(() =>
        apiClient.patch(`/api/v1/schedules/availability-exceptions/${id}/`, formData)
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
        data: mapAvailabilityException(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para DELETE
export interface DeleteAvailabilityExceptionSuccess {
    success: true;
    message: string;
    status: number;
}

export interface DeleteAvailabilityExceptionError {
    success: false;
    message: string;
    status: number;
}

export type DeleteAvailabilityExceptionResult = DeleteAvailabilityExceptionSuccess | DeleteAvailabilityExceptionError;

export const deleteAvailabilityExceptionApi = async (
    id: number | string
): Promise<DeleteAvailabilityExceptionResult> => {
    const res = await apiRequest<void>(() =>
        apiClient.delete(`/api/v1/schedules/availability-exceptions/${id}/`)
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
