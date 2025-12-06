// Response type from the API (snake_case)
export interface AvailabilityResponseApi {
    date: string;
    professional_id: string;
    service_id: string;
    duration_minutes: number;
    available_times: string[];
}

// Mapped type for frontend use (camelCase)
export interface AvailabilityResponse {
    date: string;
    professionalId: string;
    serviceId: string;
    durationMinutes: number;
    availableTimes: string[];
}

// Query parameters for the availability endpoint
export interface AvailabilityParams {
    professional: string;
    service: string;
    date: string; // Format: YYYY-MM-DD
}
