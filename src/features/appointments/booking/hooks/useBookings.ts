"use client";

import { useState, useCallback } from "react";
import { Booking, BookingApi } from "../types/booking.types";
import { message } from "antd";
import {
    createBookingApi,
    createHistoricalBookingApi,
    deleteBookingApi,
    getBookingApi,
    getBookingsApi,
    BookingFilters,
    updateBookingApi,
    filterBookingsApi,
} from "../services/booking.api";
import { toCamelCase } from "@/lib/utils/case";

export const useBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);

    const fetchBookings = useCallback(async (filters: BookingFilters) => {
        setLoading(true);
        const result = await getBookingsApi(filters);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setBookings(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const fetchFilteredBookings = useCallback(async (filters: Record<string, any>, page: number = 1) => {
        setLoading(true);
        const result = await filterBookingsApi(filters, page);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setBookings(result.data);
        setCount(result.count);
        setLoading(false);
    }, []);

    const fetchBooking = async (id: number | string) => {
        setLoading(true);
        const result = await getBookingApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setBooking(result.data);
        setLoading(false);
    };

    const createBooking = async (formData: Partial<BookingApi>): Promise<{
        success: boolean;
        newObject?: Booking;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createBookingApi(formData);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            // Si hay detalles de validación, mostrarlos
            const details = result.details ? toCamelCase(result.details) : null;
            return {
                success: result.success,
                errorFields: details,
                status: result.status,
            };
        }
        message.success(result.message);
        return {
            success: result.success,
            newObject: result.data,
            status: result.status,
        };
    };

    const createHistoricalBooking = async (formData: Partial<BookingApi>): Promise<{
        success: boolean;
        newObject?: Booking;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await createHistoricalBookingApi(formData);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            const details = result.details ? toCamelCase(result.details) : null;
            return {
                success: result.success,
                errorFields: details,
                status: result.status,
            };
        }
        message.success(result.message);
        return {
            success: result.success,
            newObject: result.data,
            status: result.status,
        };
    };

    const updateBooking = async (id: number | string, formData: Partial<BookingApi>): Promise<{
        success: boolean;
        updatedObject?: Booking;
        errorFields?: Record<string, string[]>;
        status?: number;
    }> => {
        const result = await updateBookingApi(id, formData);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            // Si hay detalles de validación, mostrarlos
            const details = result.details ? toCamelCase(result.details) : null;
            return {
                success: result.success,
                errorFields: details,
                status: result.status,
            };
        }

        message.success(result.message);
        return {
            success: result.success,
            updatedObject: result.data,
            status: result.status,
        };
    };

    const deleteBooking = async (id: number | string) => {
        const result = await deleteBookingApi(id);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            return false;
        }

        message.success(result.message);
        return true;
    };

    return {
        bookings,
        booking,
        loading,
        count,
        fetchBookings,
        fetchBooking,
        createBooking,
        createHistoricalBooking,
        updateBooking,
        deleteBooking,
        fetchFilteredBookings,
    };
};
