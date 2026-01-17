import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import { CategoryApi, Category } from "../types/category.types";

export const mapCategory = (apiCategory: CategoryApi): Category => ({
    id: apiCategory.id,
    name: apiCategory.name,
    description: apiCategory.description,
    logo: apiCategory.logo,
    isActive: apiCategory.is_active,
    created: apiCategory.created,
    modified: apiCategory.modified,
    createdBy: apiCategory.created_by,
    updatedBy: apiCategory.updated_by,
});

export interface CategoryFilters {
    page?: number;
    search?: string;
    per_page?: number;
    is_active?: boolean;
}

// Tipo de retorno para GET lista
export interface GetCategoriesSuccess {
    success: true;
    data: Category[];
    count: number;
    message: string;
    status: number;
}

export interface GetCategoriesError {
    success: false;
    message: string;
    status: number;
}

export type GetCategoriesResult = GetCategoriesSuccess | GetCategoriesError;

export const getCategoriesApi = async (filters?: CategoryFilters): Promise<GetCategoriesResult> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());
    if (filters?.is_active !== undefined) params.append("is_active", filters.is_active ? "1" : "0");

    const res = await apiRequest<CategoryApi[]>(() =>
        apiClient.get(`/api/v1/organizations/categories/?${params.toString()}`)
    );

    if (!res.success) {
        return {
            success: false,
            message: res.message,
            status: res.status,
        };
    }

    return {
        success: true,
        data: res.data?.map(mapCategory) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para GET por id
export interface GetCategorySuccess {
    success: true;
    data: Category;
    message: string;
    status: number;
}

export interface GetCategoryError {
    success: false;
    message: string;
    status: number;
}

export type GetCategoryResult = GetCategorySuccess | GetCategoryError;

export const getCategoryApi = async (id: number | string): Promise<GetCategoryResult> => {
    const res = await apiRequest<CategoryApi>(() =>
        apiClient.get(`/api/v1/organizations/categories/${id}/`)
    );

    if (!res.success) {
        return {
            success: false,
            message: res.message,
            status: res.status,
        };
    }

    return {
        success: true,
        data: mapCategory(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para CREATE
export interface CreateCategorySuccess {
    success: true;
    data: Category;
    message: string;
    status: number;
}

export interface CreateCategoryError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type CreateCategoryResult = CreateCategorySuccess | CreateCategoryError;

export const createCategoryApi = async (formData: Partial<CategoryApi>): Promise<CreateCategoryResult> => {
    const res = await apiRequest<CategoryApi>(() =>
        apiClient.post("/api/v1/organizations/categories/", formData)
    );

    if (!res.success) {
        return {
            success: false,
            message: res.message,
            status: res.status,
            details: res.details,
        };
    }

    return {
        success: true,
        data: mapCategory(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para UPDATE
export interface UpdateCategorySuccess {
    success: true;
    data: Category;
    message: string;
    status: number;
}

export interface UpdateCategoryError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type UpdateCategoryResult = UpdateCategorySuccess | UpdateCategoryError;

export const updateCategoryApi = async (
    id: number | string,
    formData: Partial<CategoryApi>
): Promise<UpdateCategoryResult> => {
    const res = await apiRequest<CategoryApi>(() =>
        apiClient.patch(`/api/v1/organizations/categories/${id}/`, formData)
    );

    if (!res.success) {
        return {
            success: false,
            message: res.message,
            status: res.status,
            details: res.details,
        };
    }

    return {
        success: true,
        data: mapCategory(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para DELETE
export interface DeleteCategorySuccess {
    success: true;
    message: string;
    status: number;
}

export interface DeleteCategoryError {
    success: false;
    message: string;
    status: number;
}

export type DeleteCategoryResult = DeleteCategorySuccess | DeleteCategoryError;

export const deleteCategoryApi = async (id: number | string): Promise<DeleteCategoryResult> => {
    const res = await apiRequest<void>(() =>
        apiClient.delete(`/api/v1/organizations/categories/${id}/`)
    );

    if (!res.success) {
        return {
            success: false,
            message: res.message,
            status: res.status,
        };
    }

    return {
        success: true,
        message: res.message,
        status: res.status,
    };
};
