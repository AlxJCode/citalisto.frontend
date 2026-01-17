"use server";

// Server Actions for authentication

import { redirect } from "next/navigation";
import { setSession, removeSession, getRefreshToken, setUserData } from "@/lib/auth";
import {
    loginApi,
    registerApi,
    refreshTokenApi,
    getMeApi,
    LoginCredentials,
    RegisterData,
} from "../services/auth.api";

export interface ActionResult {
    success: boolean;
    message?: string;
    error?: string;
}

/**
 * Login Server Action
 * Flow:
 * 1. Call POST /api/v1/auth/token/ to get tokens
 * 2. Store tokens in httpOnly cookies
 * 3. Call GET /api/v1/auth/me/ to get user data (ONCE)
 * 4. Store user data in httpOnly cookie for future requests
 */
export async function loginAction(credentials: LoginCredentials): Promise<ActionResult> {
    try {
        // Get tokens from /auth/token/
        const tokens = await loginApi(credentials);

        // Set session cookies
        await setSession(tokens);

        // Fetch user data from /auth/me/ (only once during login)
        const userData = await getMeApi(tokens.access);

        // Store user data in cookie with same expiration as access token
        await setUserData(userData);

        return {
            success: true,
            message: "Login successful",
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred during login",
        };
    }
}

/**
 * Register Server Action
 * Flow:
 * 1. Call POST /api/v1/auth/register/ (if exists)
 * 2. Store returned tokens in httpOnly cookies
 * 3. Fetch and store user data
 */
export async function registerAction(data: RegisterData): Promise<ActionResult> {
    try {
        const tokens = await registerApi(data);

        // Auto-login after registration
        await setSession(tokens);

        // Fetch user data from /auth/me/ (only once during registration)
        const userData = await getMeApi(tokens.access);

        // Store user data in cookie
        await setUserData(userData);

        return {
            success: true,
            message: "Registration successful",
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An error occurred during registration",
        };
    }
}

/**
 * Logout Server Action
 * Removes tokens from cookies and redirects to login
 */
export async function logoutAction(): Promise<void> {
    try {
        await removeSession();
    } catch (error) {
        console.error("Logout error:", error);
        // Always remove session even if error occurs
        await removeSession();
    }

    redirect("/login");
}

/**
 * Refresh token Server Action
 * Uses POST /api/v1/auth/token/refresh/
 * With ROTATE_REFRESH_TOKENS=True, both access and refresh tokens are rotated
 * Also refreshes user data from backend
 */
export async function refreshTokenAction(): Promise<ActionResult> {
    try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
            return {
                success: false,
                error: "No refresh token found",
            };
        }

        // Refresh returns both new access and refresh tokens (with rotation)
        const tokens = await refreshTokenApi(refreshToken);

        // Update both tokens
        await setSession(tokens);

        // Fetch fresh user data with new access token
        const userData = await getMeApi(tokens.access);

        // Update user data cookie
        await setUserData(userData);

        return {
            success: true,
            message: "Token refreshed",
        };
    } catch (error) {
        console.error("Token refresh error:", error);
        await removeSession();
        return {
            success: false,
            error: "Failed to refresh token",
        };
    }
}

/**
 * Refresh user data Server Action
 * Call after updating user profile to refresh session data
 */
export async function refreshUserDataAction(): Promise<ActionResult> {
    try {
        const { refreshUserData } = await import("@/lib/auth/session");
        const userData = await refreshUserData();

        if (!userData) {
            return {
                success: false,
                error: "Failed to refresh user data",
            };
        }

        return {
            success: true,
            message: "User data refreshed",
        };
    } catch (error) {
        console.error("Refresh user data error:", error);
        return {
            success: false,
            error: "Failed to refresh user data",
        };
    }
}
