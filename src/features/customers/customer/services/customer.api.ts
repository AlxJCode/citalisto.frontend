import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import { CustomerApi, Customer } from "../types/customer.types";
import { mapBusiness } from "@/features/organizations/business/services/business.api";

export const mapCustomer = (apiCustomer: CustomerApi): Customer => ({
    id: apiCustomer.id,
    business: apiCustomer.business,
    businessModel: apiCustomer.business_model ? mapBusiness(apiCustomer.business_model) : null,
    name: apiCustomer.name,
    lastName: apiCustomer.last_name,
    email: apiCustomer.email,
    phone: apiCustomer.phone,
    isActive: apiCustomer.is_active,
    created: apiCustomer.created,
    modified: apiCustomer.modified,
    createdBy: apiCustomer.created_by,
    updatedBy: apiCustomer.updated_by,
});

export const mapCustomerToApi = (customer: Partial<Customer>): Partial<CustomerApi> => {
    return {
        name: customer.name,
        last_name: customer.lastName,
        email: customer.email,
        phone: customer.phone,
    };
};

export interface CustomerFiltersProps {
    page?: number;
    search?: string;
    name?: string;
    name__icontains?: string;
    is_active?: boolean;
    business?: number;
}

// Tipo de retorno para GET lista
export interface GetCustomersSuccess {
    success: true;
    data: Customer[];
    count: number;
    message: string;
    status: number;
}

export interface GetCustomersError {
    success: false;
    message: string;
    status: number;
}

export type GetCustomersResult = GetCustomersSuccess | GetCustomersError;

export const getCustomersApi = async (
    filters?: CustomerFiltersProps
): Promise<GetCustomersResult> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.name) params.append("name__icontains", filters.name);
    if (filters?.name__icontains) params.append("name__icontains", filters.name__icontains);
    if (filters?.business) params.append("business", filters.business.toString());
    if (filters?.is_active !== undefined)
        params.append("is_active", filters.is_active ? "1" : "0");

    const res = await apiRequest<CustomerApi[]>(() =>
        apiClient.get(`/api/v1/customers/customers/?${params.toString()}`)
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
        data: res.data?.map(mapCustomer) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para GET por id
export interface GetCustomerSuccess {
    success: true;
    data: Customer;
    message: string;
    status: number;
}

export interface GetCustomerError {
    success: false;
    message: string;
    status: number;
}

export type GetCustomerResult = GetCustomerSuccess | GetCustomerError;

export const getCustomerApi = async (
    id: number | string
): Promise<GetCustomerResult> => {
    const res = await apiRequest<CustomerApi>(() =>
        apiClient.get(`/api/v1/customers/customers/${id}/`)
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
        data: mapCustomer(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para CREATE
export interface CreateCustomerSuccess {
    success: true;
    data: Customer;
    message: string;
    status: number;
}

export interface CreateCustomerError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type CreateCustomerResult = CreateCustomerSuccess | CreateCustomerError;

export const createCustomerApi = async (
    formData: Partial<CustomerApi>
): Promise<CreateCustomerResult> => {
    const res = await apiRequest<CustomerApi>(() =>
        apiClient.post("/api/v1/customers/customers/", formData)
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
        data: mapCustomer(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para UPDATE
export interface UpdateCustomerSuccess {
    success: true;
    data: Customer;
    message: string;
    status: number;
}

export interface UpdateCustomerError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type UpdateCustomerResult = UpdateCustomerSuccess | UpdateCustomerError;

export const updateCustomerApi = async (
    id: number | string,
    formData: Partial<CustomerApi>
): Promise<UpdateCustomerResult> => {
    const res = await apiRequest<CustomerApi>(() =>
        apiClient.patch(`/api/v1/customers/customers/${id}/`, formData)
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
        data: mapCustomer(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para DELETE
export interface DeleteCustomerSuccess {
    success: true;
    message: string;
    status: number;
}

export interface DeleteCustomerError {
    success: false;
    message: string;
    status: number;
}

export type DeleteCustomerResult = DeleteCustomerSuccess | DeleteCustomerError;

export const deleteCustomerApi = async (
    id: number | string
): Promise<DeleteCustomerResult> => {
    const res = await apiRequest<void>(() =>
        apiClient.delete(`/api/v1/customers/customers/${id}/`)
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
