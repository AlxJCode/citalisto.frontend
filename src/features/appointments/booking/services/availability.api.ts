import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import {
    AvailabilityResponseApi,
    AvailabilityResponse,
    AvailabilityParams,
} from "../types/availability.types";

// Mapper from API response to frontend format
export const mapAvailability = (apiResponse: AvailabilityResponseApi): AvailabilityResponse => ({
    date: apiResponse.date,
    professionalId: apiResponse.professional_id,
    serviceId: apiResponse.service_id,
    durationMinutes: apiResponse.duration_minutes,
    availableTimes: apiResponse.available_times,
});

// Success response type
export interface GetAvailabilitySuccess {
    success: true;
    data: AvailabilityResponse;
    message: string;
    status: number;
}

// Error response type
export interface GetAvailabilityError {
    success: false;
    message: string;
    status: number;
}

export type GetAvailabilityResult = GetAvailabilitySuccess | GetAvailabilityError;

// API function to fetch availability
export const getAvailabilityApi = async (
    params: AvailabilityParams
): Promise<GetAvailabilityResult> => {
    const queryParams = new URLSearchParams({
        professional: params.professional,
        service: params.service,
        date: params.date,
    });

    const res = await apiRequest<AvailabilityResponseApi>(() =>
        apiClient.get(`/api/v1/appointments/availability/?${queryParams.toString()}`)
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
        data: mapAvailability(res.data!),
        message: res.message,
        status: res.status,
    };
};
