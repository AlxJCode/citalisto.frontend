import axios, { AxiosInstance } from "axios";
import { ApiResponse } from "@/types/base";
import { PublicBooking } from "../types/publicBooking.types";

class PublicBookingService {
    private client: AxiosInstance;

    constructor() {
        // Crear instancia de axios sin interceptor de autenticación
        this.client = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL || "https://www.citalistoapi.iveltech.com",
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async getBooking(publicToken: string): Promise<{ success: boolean; data?: PublicBooking; message?: string }> {
        try {
            const response = await this.client.get<ApiResponse<PublicBooking>>(
                `/api/v1/appointments/public/bookings/${publicToken}/`
            );

            if (response.data.success && response.data.data) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            }

            return {
                success: false,
                message: response.data.message || "Error al obtener la cita",
            };
        } catch (error: any) {
            // Manejar errores HTTP (404, 500, etc.)
            if (error.response?.data) {
                return {
                    success: false,
                    message: error.response.data.message || error.response.data.error?.message || "Error al obtener la cita",
                };
            }

            // Error de red o timeout
            return {
                success: false,
                message: "Error de conexión. Verifica tu internet.",
            };
        }
    }

    async cancelBooking(
        publicToken: string,
        cancellationReason?: string
    ): Promise<{ success: boolean; data?: PublicBooking; message?: string }> {
        try {
            const response = await this.client.patch<ApiResponse<PublicBooking>>(
                `/api/v1/appointments/public/bookings/${publicToken}/cancel/`,
                cancellationReason ? { cancellation_reason: cancellationReason } : undefined
            );

            if (response.data.success && response.data.data) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message,
                };
            }

            return {
                success: false,
                message: response.data.message || "Error al cancelar la cita",
            };
        } catch (error: any) {
            // Manejar errores HTTP
            if (error.response?.data) {
                const errorData = error.response.data;
                return {
                    success: false,
                    message: errorData.message || errorData.error?.message || errorData.errors?.non_field_errors?.[0] || "Error al cancelar",
                };
            }

            // Error de red o timeout
            return {
                success: false,
                message: "Error de conexión. Verifica tu internet.",
            };
        }
    }
}

export const publicBookingService = new PublicBookingService();
