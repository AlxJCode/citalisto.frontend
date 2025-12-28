"use client";

import { useState } from "react";
import { notification } from "antd";
import {
    getProfessionalsApi,
    getAvailabilityApi,
    createPublicBookingApi,
    getBranchessApi,
} from "../services/public-booking.api";
import type {
    PublicProfessional,
    PublicAvailability,
    CreatePublicBookingPayload,
    PublicBookingResponse,
} from "../types/public-booking.types";

export const usePublicBooking = (businessSlug: string) => {
    const [loading, setLoading] = useState(false);

    const getBranches= async () => {
        setLoading(true);
        try {
            const result = await getBranchessApi(businessSlug);

            if (!result.success) {
                notification.error({
                    title: "Error al cargar sucursales",
                    description: `E-${result.status} - ${result.message}`,
                    placement: "topRight",
                    duration: 10,
                });
            }

            return result;
        } finally {
            setLoading(false);
        }
    };

    const getProfessionals = async (branchId: string) => {
        setLoading(true);
        try {
            const result = await getProfessionalsApi(businessSlug, branchId);

            if (!result.success) {
                notification.error({
                    title: "Error al cargar profesionales",
                    description: `E-${result.status} - ${result.message}`,
                    placement: "topRight",
                    duration: 10,
                });
            }

            return result;
        } finally {
            setLoading(false);
        }
    };

    const getAvailability = async (professionalId: string, serviceId: string, date: string) => {
        setLoading(true);
        try {
            const result = await getAvailabilityApi(businessSlug, professionalId, serviceId, date);

            if (!result.success) {
                notification.error({
                    title: "Error al cargar disponibilidad",
                    description: `E-${result.status} - ${result.message}`,
                    placement: "topRight",
                    duration: 10,
                });
            }

            return result;
        } finally {
            setLoading(false);
        }
    };

    const createBooking = async (payload: CreatePublicBookingPayload) => {
        setLoading(true);
        try {
            const result = await createPublicBookingApi(businessSlug, payload);

            if (!result.success) {
                notification.error({
                    title: "Error al crear la reserva",
                    description: `E-${result.status} - ${result.message}`,
                    placement: "topRight",
                    duration: 10,
                });
                return result;
            }

            notification.success({
                title: "¡Reserva creada exitosamente!",
                description: result.message || "Tu cita ha sido confirmada.",
                placement: "topRight",
                duration: 10,
            });
            return result;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        getProfessionals,
        getAvailability,
        createBooking,
        getBranches,
    };
};
