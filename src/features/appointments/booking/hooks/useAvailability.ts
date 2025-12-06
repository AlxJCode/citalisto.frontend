"use client";

import { useState, useCallback } from "react";
import { AvailabilityResponse, AvailabilityParams } from "../types/availability.types";
import { message } from "antd";
import { getAvailabilityApi } from "../services/availability.api";

export const useAvailability = () => {
    const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchAvailability = useCallback(async (params: AvailabilityParams) => {
        setLoading(true);
        const result = await getAvailabilityApi(params);

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            setAvailability(null);
            return;
        }

        setAvailability(result.data);
        setLoading(false);
    }, []);

    const clearAvailability = useCallback(() => {
        setAvailability(null);
    }, []);

    return {
        availability,
        loading,
        fetchAvailability,
        clearAvailability,
    };
};
