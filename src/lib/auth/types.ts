// Auth types for session and tokens

import { Business } from "@/features/organizations/business/types/business.types";
import { CategoryApi } from "@/features/organizations/category/types/category.types";
import { UserRole } from "@/features/users/user/types/user.api";

// Session user (from /auth/me/ endpoint) - camelCase
export interface SessionUser {
    id: number;
    username: string;
    email: string;
    dni?: string | null;
    firstName: string;
    lastName: string;
    motherLastName?: string;
    phone?: string | null;
    role: UserRole;
    roleDisplay: string;
    business?: number | null;
    businessModel?: Business | null;
    profilePicture?: string | null;
    isActive: boolean;
    isStaff: boolean;
    passwordChangeRequired: boolean;
    lastPasswordChange?: string | null;
    created: string;
    modified: string;
}

// JWT Token payload (minimal - only user_id, exp, iat, jti)
export interface DecodedToken {
    token_type: "access" | "refresh";
    user_id: number;
    exp: number;
    iat: number;
    jti: string;
}

// Token response from /auth/token/ endpoint
export interface AuthTokens {
    access: string;
    refresh: string;
}

export class AuthError extends Error {
    constructor(
        message: string,
        public code: "UNAUTHORIZED" | "TOKEN_EXPIRED" | "INVALID_TOKEN" | "SESSION_NOT_FOUND"
    ) {
        super(message);
        this.name = "AuthError";
    }
}
