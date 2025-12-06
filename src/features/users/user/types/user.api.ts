// API response types for User (snake_case)

import { BusinessApi } from "@/features/organizations/business/types/business.types";
import { BaseModel, BaseModelCamel } from "@/types/base";

// User roles enum
export type UserRole = "SUPERADMIN" | "OWNER" | "STAFF" | "CUSTOMER";

// User API interface in snake_case
export interface UserApi extends BaseModel {
    username: string;
    dni?: string | null;
    first_name: string;
    last_name: string;
    mother_last_name?: string;
    email: string;
    business?: number | null;
    business_model?: BusinessApi | null;
    role: UserRole;
    role_display?: string;
    profile_picture?: string | null;
    last_password_change?: string | null;
    password_change_required: boolean;
    is_staff: boolean;
}

export interface User extends BaseModelCamel {
    username: string;
    dni?: string | null;
    firstName: string;
    lastName: string;
    motherLastName?: string;
    email: string;
    business?: number | null;
    businessModel?: BusinessApi | null;
    role: UserRole;
    profilePicture?: string | null;
    lastPasswordChange?: string | null;
    passwordChangeRequired: boolean;
    isStaff: boolean;
}
