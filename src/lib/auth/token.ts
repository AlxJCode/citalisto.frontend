// Token utilities - decode and verify JWT

import { DecodedToken, AuthError } from "./types";

/**
 * Decode JWT token without verification
 * Use only for reading claims, always verify on server
 */
export function decodeToken(token: string): DecodedToken {
    try {
        const base64Url = token.split(".")[1];
        if (!base64Url) {
            throw new AuthError("Invalid token format", "INVALID_TOKEN");
        }

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        throw new AuthError("Failed to decode token", "INVALID_TOKEN");
    }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
    try {
        const decoded = decodeToken(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch {
        return true;
    }
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpiration(token: string): number | null {
    try {
        const decoded = decodeToken(token);
        return decoded.exp * 1000;
    } catch {
        return null;
    }
}
