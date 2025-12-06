// Types for Service model
import { Business, BusinessApi } from "@/features/organizations/business/types/business.types";
import { BaseModelCamel } from "@/types/base";
// API response types for Service (snake_case)
import { BaseModel } from "@/types/base";

// Service API interface in snake_case
export interface ServiceApi extends BaseModel {
    business: number;
    business_model?: BusinessApi;
    name: string;
    description?: string | null;
    price: string;
    is_public: boolean;
    duration_minutes: number;
}

// Frontend Service type (camelCase)

export interface Service extends BaseModelCamel {
    business: number;
    businessModel?: Business | null;
    name: string;
    description?: string | null;
    price: string;
    isPublic: boolean;
    durationMinutes: number;
}
