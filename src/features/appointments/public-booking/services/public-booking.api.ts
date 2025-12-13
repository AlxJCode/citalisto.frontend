// Public Booking API - No authentication required

import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/base";
import type {
    PublicProfessional,
    PublicAvailability,
    CreatePublicBookingPayload,
    PublicBookingResponse,
    PublicBranch,
} from "../types/public-booking.types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://www.citalistoapi.iveltech.com";

// Cliente axios sin interceptors (sin auth)
const publicClient = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

const getBaseUrl = (slug: string) => `/api/v1/appointments/public/business/${slug}`;

// Helper para extraer error info del ApiResponse
interface ErrorResult {
    success: false;
    status: number;
    message: string;
    details?: Record<string, string[]> | string | string[];
}

function handleError(error: unknown): ErrorResult {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        const response = axiosError.response;

        if (response?.data) {
            return {
                success: false,
                status: response.data.error?.code || response.status,
                message:
                    response.data.message || response.data.error?.message || "Error desconocido",
                details: response.data.error?.details,
            };
        }

        return {
            success: false,
            status: response?.status || 500,
            message: axiosError.message || "Error de conexión",
        };
    }

    return {
        success: false,
        status: 500,
        message: "Error inesperado",
    };
}

// 1. GET /professionals/
export async function getProfessionalsApi(slug: string, branchId: string) {
    try {
        const { data } = await publicClient.get<ApiResponse<{ results: PublicProfessional[] }>>(
            `${getBaseUrl(slug)}/professionals/`,
            { params: { branch_id: branchId } }
        );

        if (!data.success) {
            return {
                success: false,
                status: data.error?.code || 500,
                message: data.message,
                data: [],
            };
        }

        return {
            success: true,
            status: 200,
            message: data.message,
            data: data.data?.results || [],
        };
    } catch (error) {
        return { ...handleError(error), data: [] };
    }
}

// 1. GET /branches/
export async function getBranchessApi(slug: string) {
    try {
        const { data } = await publicClient.get<ApiResponse<{ results: PublicBranch[] }>>(
            `${getBaseUrl(slug)}/branches/`,
            
        );

        if (!data.success) {
            return {
                success: false,
                status: data.error?.code || 500,
                message: data.message,
                data: [],
            };
        }

        return {
            success: true,
            status: 200,
            message: data.message,
            data: data.data?.results || [],
        };
    } catch (error) {
        return { ...handleError(error), data: [] };
    }
}

// 2. GET /availability/
export async function getAvailabilityApi(
    slug: string,
    professionalId: string,
    serviceId: string,
    date: string
) {
    try {
        const { data } = await publicClient.get<ApiResponse<PublicAvailability>>(
            `${getBaseUrl(slug)}/availability/`,
            {
                params: {
                    professional_id: professionalId,
                    service_id: serviceId,
                    date,
                },
            }
        );

        if (!data.success) {
            return {
                success: false,
                status: data.error?.code || 500,
                message: data.message,
                data: null,
            };
        }

        return {
            success: true,
            status: 200,
            message: data.message,
            data: data.data,
        };
    } catch (error) {
        return { ...handleError(error), data: null };
    }
}

// 3. POST /bookings/
export async function createPublicBookingApi(slug: string, payload: CreatePublicBookingPayload) {
    try {
        const { data } = await publicClient.post<ApiResponse<PublicBookingResponse>>(
            `${getBaseUrl(slug)}/bookings/`,
            payload
        );

        if (!data.success) {
            return {
                success: false,
                status: data.error?.code || 500,
                message: data.message,
                details: data.error?.details,
                data: null,
            };
        }

        return {
            success: true,
            status: 201,
            message: data.message,
            data: data.data,
        };
    } catch (error) {
        return { ...handleError(error), data: null };
    }
}
