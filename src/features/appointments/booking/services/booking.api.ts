import { apiClient } from "@/lib/api/client";
import { apiRequest } from "@/lib/api/apiRequest";
import { BookingApi, Booking } from "../types/booking.types";
import { mapBusiness } from "@/features/organizations/business/services/business.api";
import { mapBranch } from "@/features/organizations/branch/services/branch.api";
import { mapProfessional } from "@/features/professionals/professional/services/professional.api";
import { mapService } from "@/features/services-catalog/service/services/service.api";
import { mapCustomer } from "@/features/customers/customer/services/customer.api";

export const mapBooking = (apiBooking: BookingApi): Booking => ({
    id: apiBooking.id,
    business: apiBooking.business,
    businessModel: apiBooking.business_model ? mapBusiness(apiBooking.business_model) : null,
    branch: apiBooking.branch,
    branchModel: apiBooking.branch_model ? mapBranch(apiBooking.branch_model) : null,
    professional: apiBooking.professional,
    professionalModel: apiBooking.professional_model
        ? mapProfessional(apiBooking.professional_model)
        : null,
    isActive: apiBooking.is_active,
    autoConfirmed: apiBooking.auto_confirmed,
    notifyByEmail: apiBooking.notify_by_email,
    notifyByWhatsapp: apiBooking.notify_by_whatsapp,
    source: apiBooking.source,
    price: apiBooking.price,
    service: apiBooking.service,
    serviceModel: apiBooking.service_model ? mapService(apiBooking.service_model) : null,
    customer: apiBooking.customer,
    customerModel: apiBooking.customer_model ? mapCustomer(apiBooking.customer_model) : null,
    date: apiBooking.date,
    startTime: apiBooking.start_time,
    endTime: apiBooking.end_time,
    status: apiBooking.status,
    notes: apiBooking.notes,
    created: apiBooking.created,
    modified: apiBooking.modified,
    createdBy: apiBooking.created_by,
    updatedBy: apiBooking.updated_by,
});

export const mapBookingToApi = (booking: Partial<Booking>): Partial<BookingApi> => {
    return {
        business: booking.business,
        branch: booking.branch,
        professional: booking.professional,
        service: booking.service,
        price: booking.price,
        customer: booking.customer,
        date: booking.date,
        start_time: booking.startTime,
        end_time: booking.endTime,
        status: booking.status,
        notes: booking.notes,
        notify_by_whatsapp: booking.notifyByWhatsapp,
        notify_by_email: booking.notifyByEmail,
        auto_confirmed: booking.autoConfirmed,
        source: booking.source,
    };
};

export interface BookingFilters {
    page?: number;
    search?: string;
    business?: number;
    branch?: number;
    professional?: number;
    customer?: number;
    status?: string;
    date?: string;
    start_date?: string;
    end_date?: string;
}

// Tipo de retorno para GET lista
export interface GetBookingsSuccess {
    success: true;
    data: Booking[];
    count: number;
    message: string;
    status: number;
}

export interface GetBookingsError {
    success: false;
    message: string;
    status: number;
}

export type GetBookingsResult = GetBookingsSuccess | GetBookingsError;

export const getBookingsApi = async (
    filters?: BookingFilters
): Promise<GetBookingsResult> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.business) params.append("business", filters.business.toString());
    if (filters?.branch) params.append("branch", filters.branch.toString());
    if (filters?.professional) params.append("professional", filters.professional.toString());
    if (filters?.customer) params.append("customer", filters.customer.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.date) params.append("date", filters.date);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    const res = await apiRequest<BookingApi[]>(() =>
        apiClient.get(`/api/v1/appointments/bookings/?${params.toString()}`)
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
        data: res.data?.map(mapBooking) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

export const filterBookingsApi = async (
    filters?: Record<string, any>, page?: number
): Promise<GetBookingsResult> => {

    const res = await apiRequest<BookingApi[]>(() =>
        apiClient.post(`/api/v1/appointments/bookings/filter/${page ? `?page=${page}` : ``}`, filters)
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
        data: res.data?.map(mapBooking) || [],
        count: res.meta?.pagination?.total ?? 0,
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para GET por id
export interface GetBookingSuccess {
    success: true;
    data: Booking;
    message: string;
    status: number;
}

export interface GetBookingError {
    success: false;
    message: string;
    status: number;
}

export type GetBookingResult = GetBookingSuccess | GetBookingError;

export const getBookingApi = async (
    id: number | string
): Promise<GetBookingResult> => {
    const res = await apiRequest<BookingApi>(() =>
        apiClient.get(`/api/v1/appointments/bookings/${id}/`)
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
        data: mapBooking(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para CREATE
export interface CreateBookingSuccess {
    success: true;
    data: Booking;
    message: string;
    status: number;
}

export interface CreateBookingError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type CreateBookingResult = CreateBookingSuccess | CreateBookingError;

export const createBookingApi = async (
    formData: Partial<BookingApi>
): Promise<CreateBookingResult> => {
    const res = await apiRequest<BookingApi>(() =>
        apiClient.post("/api/v1/appointments/bookings/create/", formData)
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
        data: mapBooking(res.data!),
        message: res.message,
        status: res.status,
    };
};

export const createHistoricalBookingApi = async (
    formData: Partial<BookingApi>
): Promise<CreateBookingResult> => {
    const res = await apiRequest<BookingApi>(() =>
        apiClient.post("/api/v1/appointments/bookings/historical/create/", formData)
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
        data: mapBooking(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para UPDATE
export interface UpdateBookingSuccess {
    success: true;
    data: Booking;
    message: string;
    status: number;
}

export interface UpdateBookingError {
    success: false;
    message: string;
    status: number;
    details?: any; // Errores de validación del backend
}

export type UpdateBookingResult = UpdateBookingSuccess | UpdateBookingError;

export const updateBookingApi = async (
    id: number | string,
    formData: Partial<BookingApi>
): Promise<UpdateBookingResult> => {
    const res = await apiRequest<BookingApi>(() =>
        apiClient.patch(`/api/v1/appointments/bookings/${id}/`, formData)
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
        data: mapBooking(res.data!),
        message: res.message,
        status: res.status,
    };
};

// Tipo de retorno para DELETE
export interface DeleteBookingSuccess {
    success: true;
    message: string;
    status: number;
}

export interface DeleteBookingError {
    success: false;
    message: string;
    status: number;
}

export type DeleteBookingResult = DeleteBookingSuccess | DeleteBookingError;

export const deleteBookingApi = async (
    id: number | string
): Promise<DeleteBookingResult> => {
    const res = await apiRequest<void>(() =>
        apiClient.delete(`/api/v1/appointments/bookings/${id}/`)
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
