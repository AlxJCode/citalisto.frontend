// Axios client configuration with interceptors

import axios, { InternalAxiosRequestConfig } from "axios";

// Create axios instance
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://www.citalistoapi.iveltech.com",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

let cachedToken: string | null = null;

const getToken = async (): Promise<string | null> => {
    if (cachedToken) {
        return cachedToken;
    }

    try {
        const response = await fetch("/api/auth/token");
        const data = await response.json();
        cachedToken = data.token;
        return cachedToken;
    } catch (error) {
        console.error("🔴 Error fetching token:", error);
        return null;
    }
};

// Función para invalidar cache (llamar después de login/logout)
export const clearTokenCache = () => {
    console.log("🟡 Clearing token cache");
    cachedToken = null;
};

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor para manejar errores de autenticación
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;

        // Si el token expiró o no es válido (401/403)
        if (status === 401 || status === 403) {
            console.log("🔴 Token expired or invalid, redirecting to login");

            // Limpiar cache del token
            clearTokenCache();

            // Limpiar cookies del lado del cliente (llamar a la API route)
            try {
                await fetch("/api/auth/logout", { method: "POST" });
            } catch (e) {
                console.error("Error clearing session:", e);
            }

            // Redirigir al login
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

