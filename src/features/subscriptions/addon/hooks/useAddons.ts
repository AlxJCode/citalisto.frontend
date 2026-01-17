"use client";

import { useState } from "react";
import { message } from "antd";
import { AddonsSummary } from "../types/addon.types";
import { getAddonsSummaryApi } from "../services/addon.api";

export const useAddons = () => {
    const [addons, setAddons] = useState<AddonsSummary | null | undefined>(null);
    const [loading, setLoading] = useState(false);

    const fetchAddons = async () => {
        setLoading(true);
        try {
            const res = await getAddonsSummaryApi();
            if (!res.success) {
                message.error(res.message);
                return;
            }
            setAddons(res.data);
        } catch {
            message.error("Error al cargar addons");
        } finally {
            setLoading(false);
        }
    };

    return { addons, loading, fetchAddons };
};
