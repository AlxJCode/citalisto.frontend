"use client";

// Client-side auth hook

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    loginAction,
    registerAction,
    logoutAction,
    refreshTokenAction,
    ActionResult,
} from "../actions/auth.actions";
import { LoginCredentials, RegisterData } from "../services/auth.api";
import { clearTokenCache } from "@/lib/api/client";

export interface UseAuthReturn {
    /**
     * Login user with email and password
     */
    login: (credentials: LoginCredentials) => Promise<ActionResult>;

    /**
     * Register new user
     */
    register: (data: RegisterData) => Promise<ActionResult>;

    /**
     * Logout current user
     */
    logout: () => Promise<void>;

    /**
     * Refresh access token
     */
    refresh: () => Promise<ActionResult>;

    /**
     * Loading state for auth operations
     */
    isPending: boolean;
}

/**
 * Client-side authentication hook
 * Uses Server Actions for all auth operations
 * Session is managed server-side via httpOnly cookies
 *
 * Usage:
 * ```tsx
 * const { login, logout, isPending } = useAuth();
 *
 * const handleLogin = async (email: string, password: string) => {
 *   const result = await login({ email, password });
 *   if (result.success) {
 *     router.push('/dashboard');
 *   }
 * };
 * ```
 */
export function useAuth(): UseAuthReturn {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const login = useCallback(
        async (credentials: LoginCredentials): Promise<ActionResult> => {
            let result: ActionResult = { success: false };

            await new Promise<void>((resolve) => {
                startTransition(async () => {
                    result = await loginAction(credentials);
                    if (result.success) {
                        clearTokenCache(); // Invalidar cache para obtener nuevo token
                        router.refresh();
                    }
                    resolve();
                });
            });

            return result;
        },
        [router]
    );

    const register = useCallback(
        async (data: RegisterData): Promise<ActionResult> => {
            let result: ActionResult = { success: false };

            await new Promise<void>((resolve) => {
                startTransition(async () => {
                    result = await registerAction(data);
                    if (result.success) {
                        clearTokenCache(); // Invalidar cache para obtener nuevo token
                        router.refresh();
                    }
                    resolve();
                });
            });

            return result;
        },
        [router]
    );

    const logout = useCallback(async (): Promise<void> => {
        clearTokenCache(); // Limpiar cache al hacer logout
        startTransition(async () => {
            await logoutAction();
            // logoutAction redirects, so no need to refresh
        });
    }, []);

    const refresh = useCallback(async (): Promise<ActionResult> => {
        let result: ActionResult = { success: false };

        await new Promise<void>((resolve) => {
            startTransition(async () => {
                result = await refreshTokenAction();
                if (result.success) {
                    clearTokenCache(); // Invalidar cache para obtener nuevo token
                    router.refresh();
                }
                resolve();
            });
        });

        return result;
    }, [router]);

    return {
        login,
        register,
        logout,
        refresh,
        isPending,
    };
}
