// Base interfaces that all models inherit from

// BaseModel fields (inherited by all models in snake_case)
export interface BaseModel {
    id: number;
    is_active: boolean;
    created: string;
    modified: string;
    created_by?: number | null;
    updated_by?: number | null;
}

// BaseModel in camelCase
export interface BaseModelCamel {
    id: number;
    isActive: boolean;
    created: string;
    modified: string;
    createdBy?: number | null;
    updatedBy?: number | null;
}

// Pagination metadata
export interface PaginationMeta {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
}

// Error types
export enum ErrorType {
    VALIDATION_ERROR = "validation_error",
    AUTHENTICATION_ERROR = "authentication_error",
    AUTHORIZATION_ERROR = "authorization_error",
    NOT_FOUND = "not_found",
    BUSINESS_LOGIC_ERROR = "business_logic_error",
    INTERNAL_ERROR = "internal_error",
}

// Error metadata
export interface ErrorMeta {
    code: number;
    type: ErrorType;
    message: string;
    details?: string | Record<string, string[]> | string[] | Record<string, any>;
    timestamp: string;
}

// Meta information
export interface MetaInfo {
    version: string;
    timestamp: string;
    processing_time_ms: number;
    pagination?: PaginationMeta;
    deprecated?: boolean;
    replacement?: string;
}

// Standard API Response structure
export interface ApiResponse<T = any> {
    success: boolean;
    status: "success" | "error";
    message: string;
    data: T | null;
    meta: MetaInfo;
    error?: ErrorMeta;
}

// Paginated API Response
export interface ApiResponsePaginated<T> extends ApiResponse<T[]> {
    meta: MetaInfo & {
        pagination: PaginationMeta;
    };
}

// API Error class for easier error handling
export class ApiError extends Error {
    constructor(
        message: string,
        public code: number,
        public type?: ErrorType,
        public details?: any
    ) {
        super(message);
        this.name = "ApiError";
    }
}
