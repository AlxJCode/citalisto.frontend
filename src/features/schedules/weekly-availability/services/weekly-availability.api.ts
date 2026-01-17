import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import { mapProfessional } from "@/features/professionals/professional/services/professional.api";
import { ProfessionalWeeklyAvailability, ProfessionalWeeklyAvailabilityApi } from "../types/professional-weekly-availability.types";

export const mapWeeklyAvailability = (
    apiAvailability: ProfessionalWeeklyAvailabilityApi
): ProfessionalWeeklyAvailability => ({
    id: apiAvailability.id,
    professional: apiAvailability.professional,
    professionalModel: apiAvailability.professional_model
        ? mapProfessional(apiAvailability.professional_model)
        : null,
    dayOfWeek: apiAvailability.day_of_week,
    startTime: apiAvailability.start_time,
    isActive: apiAvailability.is_active,
    endTime: apiAvailability.end_time,
    enabled: apiAvailability.enabled,
    breakStartTime: apiAvailability.break_start_time,
    breakEndTime: apiAvailability.break_end_time,
    created: apiAvailability.created,
    modified: apiAvailability.modified,
    createdBy: apiAvailability.created_by,
    updatedBy: apiAvailability.updated_by,
});

export interface WeeklyAvailabilityFilters {
    page?: number;
    search?: string;
    professional?: number;
    day_of_week?: number;
}

// Tipo de retorno para GET lista
export interface GetWeeklyAvailabilitiesSuccess {
    success: true;
    data: ProfessionalWeeklyAvailability[];
    count: number;
    message: string;
    status: number;
}

export interface GetWeeklyAvailabilitiesError {
    success: false;
    message: string;
    status: number;
}

export type GetWeeklyAvailabilitiesResult = GetWeeklyAvailabilitiesSuccess | GetWeeklyAvailabilitiesError;

export const getWeeklyAvailabilitiesApi = async (
    filters?: WeeklyAvailabilityFilters
): Promise<GetWeeklyAvailabilitiesResult> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.professional) params.append("professional", filters.professional.toString());
    if (filters?.day_of_week !== undefined)
        params.append("day_of_week", filters.day_of_week.toString());

    const res = await apiRequest<ProfessionalWeeklyAvailabilityApi[]>(() =>
        apiClient.get(`/api/v1/schedules/weekly-availabilities/?${params.toString()}`)
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
        data: res.data?.map(mapWeeklyAvailability) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para GET por id
export interface GetWeeklyAvailabilitySuccess {
    success: true;
    data: ProfessionalWeeklyAvailability;
    message: string;
    status: number;
}

export interface GetWeeklyAvailabilityError {
    success: false;
    message: string;
    status: number;
}

export type GetWeeklyAvailabilityResult = GetWeeklyAvailabilitySuccess | GetWeeklyAvailabilityError;

export const getWeeklyAvailabilityApi = async (
    id: number | string
): Promise<GetWeeklyAvailabilityResult> => {
    const res = await apiRequest<ProfessionalWeeklyAvailabilityApi>(() =>
        apiClient.get(`/api/v1/schedules/weekly-availabilities/${id}/`)
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
        data: mapWeeklyAvailability(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para CREATE
export interface CreateWeeklyAvailabilitySuccess {
    success: true;
    data: ProfessionalWeeklyAvailability;
    message: string;
    status: number;
}

export interface CreateWeeklyAvailabilityError {
    success: false;
    message: string;
    status: number;
    details?: any;
}

export type CreateWeeklyAvailabilityResult = CreateWeeklyAvailabilitySuccess | CreateWeeklyAvailabilityError;

export const createWeeklyAvailabilityApi = async (
    formData: Partial<ProfessionalWeeklyAvailabilityApi>
): Promise<CreateWeeklyAvailabilityResult> => {
    const res = await apiRequest<ProfessionalWeeklyAvailabilityApi>(() =>
        apiClient.post("/api/v1/schedules/weekly-availabilities/", formData)
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
        data: mapWeeklyAvailability(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para UPDATE
export interface UpdateWeeklyAvailabilitySuccess {
    success: true;
    data: ProfessionalWeeklyAvailability;
    message: string;
    status: number;
}

export interface UpdateWeeklyAvailabilityError {
    success: false;
    message: string;
    status: number;
    details?: any;
}

export type UpdateWeeklyAvailabilityResult = UpdateWeeklyAvailabilitySuccess | UpdateWeeklyAvailabilityError;

export const updateWeeklyAvailabilityApi = async (
    id: number | string,
    formData: Partial<ProfessionalWeeklyAvailabilityApi>
): Promise<UpdateWeeklyAvailabilityResult> => {
    const res = await apiRequest<ProfessionalWeeklyAvailabilityApi>(() =>
        apiClient.patch(`/api/v1/schedules/weekly-availabilities/${id}/`, formData)
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
        data: mapWeeklyAvailability(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para DELETE
export interface DeleteWeeklyAvailabilitySuccess {
    success: true;
    message: string;
    status: number;
}

export interface DeleteWeeklyAvailabilityError {
    success: false;
    message: string;
    status: number;
}

export type DeleteWeeklyAvailabilityResult = DeleteWeeklyAvailabilitySuccess | DeleteWeeklyAvailabilityError;

export const deleteWeeklyAvailabilityApi = async (
    id: number | string
): Promise<DeleteWeeklyAvailabilityResult> => {
    const res = await apiRequest<void>(() =>
        apiClient.delete(`/api/v1/schedules/weekly-availabilities/${id}/`)
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
