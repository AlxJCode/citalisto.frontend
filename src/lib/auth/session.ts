// Server-side session management using httpOnly cookies

import { cookies } from "next/headers";
import { SessionUser, AuthError } from "./types";
import { isTokenExpired } from "./token";
import { getMeApi } from "@/features/auth/services/auth.api";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const USER_DATA_COOKIE = "user_data";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

/**
 * Set user data in httpOnly cookie
 * Saves user information with same expiration as access token
 */
export async function setUserData(userData: SessionUser): Promise<void> {
    const cookieStore = await cookies();

    // Store user data as JSON in httpOnly cookie (same expiration as access token)
    cookieStore.set(USER_DATA_COOKIE, JSON.stringify(userData), {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24, // 1 day (same as access token)
    });
}

/**
 * Get user data from cookie
 * Returns cached user data without making HTTP request
 */
export async function getUserData(): Promise<SessionUser | null> {
    try {
        const cookieStore = await cookies();
        const userDataCookie = cookieStore.get(USER_DATA_COOKIE)?.value;

        if (!userDataCookie) {
            return null;
        }

        return JSON.parse(userDataCookie) as SessionUser;
    } catch (error) {
        console.error("Failed to parse user data from cookie:", error);
        return null;
    }
}

/**
 * Get current session from cookies
 * Reads cached user data from cookie (no HTTP request)
 * Must be called from Server Component or Server Action
 */
export async function getSession(): Promise<SessionUser | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

        if (!accessToken) {
            return null;
        }

        // Check if token is expired
        if (isTokenExpired(accessToken)) {
            return null;
        }

        // Get user data from cookie (no HTTP request)
        const userData = await getUserData();

        return userData;
    } catch (error) {
        console.error("Failed to get session:", error);
        return null;
    }
}

/**
 * Get access token from cookies
 */
export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value || null;
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value || null;
}

/**
 * Set session tokens in httpOnly cookies
 * Must be called from Server Action or Route Handler
 * Note: Auth tokens have structure { access: "...", refresh: "..." }
 */
export async function setSession(tokens: { access: string; refresh: string }): Promise<void> {
    const cookieStore = await cookies();

    // Access token expires in 1 day (as per backend config)
    cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.access, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24, // 1 day
    });

    // Refresh token expires in 7 days (as per backend config)
    cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refresh, {
        ...COOKIE_OPTIONS,
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

/**
 * Remove session (logout)
 * Must be called from Server Action or Route Handler
 */
export async function removeSession(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.delete(ACCESS_TOKEN_COOKIE);
    cookieStore.delete(REFRESH_TOKEN_COOKIE);
    cookieStore.delete(USER_DATA_COOKIE);
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return session !== null;
}

/**
 * Require authentication - throws error if not authenticated
 * Useful for Server Components that require auth
 */
export async function requireAuth(): Promise<SessionUser> {
    const session = await getSession();

    if (!session) {
        throw new AuthError("Authentication required", "UNAUTHORIZED");
    }

    return session;
}

/**
 * Refresh user data from backend
 * Call this after updating user profile, password, or role changes
 * Invalidates cache and fetches fresh data from /auth/me/
 */
export async function refreshUserData(): Promise<SessionUser | null> {
    try {
        const accessToken = await getAccessToken();

        if (!accessToken) {
            return null;
        }

        // Fetch fresh user data from backend
        const userData = await getMeApi(accessToken);

        // Update cookie with fresh data
        await setUserData(userData);

        return userData;
    } catch (error) {
        console.error("Failed to refresh user data:", error);
        return null;
    }
}
