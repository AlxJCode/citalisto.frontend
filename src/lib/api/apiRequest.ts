import { AxiosResponse } from "axios";
import { ApiResponse } from "@/types/base";

export interface NormalizedSuccess<T> {
    success: true;
    data: T | null;
    message: string;
    status: number;
    meta: ApiResponse<T>["meta"];
}

export interface NormalizedError {
    success: false;
    message: string;
    status: number;
    type?: string;
    details?: any;
    meta?: any;
}

export type NormalizedResult<T> = NormalizedSuccess<T> | NormalizedError;

/**
 * apiRequest: Normaliza la respuesta del backend sin lanzar errores.
 * Siempre retorna { success, data?, message, status, meta }
 * @param fn Función que retorna una Promise de Axios
 * @returns NormalizedResult con success discriminator
 */
export async function apiRequest<T>(
    fn: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<NormalizedResult<T>> {
    try {
        const response = await fn();
        const api = response.data;

        // Caso éxito
        if (api.success) {
            return {
                success: true,
                data: api.data,
                message: api.message,
                status: response.status,
                meta: api.meta,
            };
        }

        // Caso error del backend (success = false)
        return {
            success: false,
            message: api.message,
            status: api.error?.code || response.status,
            type: api.error?.type,
            details: api.error?.details,
            meta: api.meta,
        };
    } catch (error: any) {
        console.log("error from apiRequest", error);
        const res = error?.response;

        // Error controlado por Axios con ApiResponse
        if (res?.data) {
            const api = res.data as ApiResponse<any>;
            return {
                success: false,
                message: api.message || "Error del servidor",
                status: api.error?.code || res.status,
                type: api.error?.type,
                details: api.error?.details,
                meta: api.meta,
            };
        }

        // Error sin respuesta (timeout, red, DNS)
        return {
            success: false,
            message: "No se pudo conectar con el servidor",
            status: 503,
        };
    }
}
