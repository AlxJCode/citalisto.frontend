"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export const useUrlFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const getFilter = (key: string) => searchParams.get(key) || undefined;

    const setFilters = useCallback(
        (filters: Record<string, string | undefined>) => {
            const params = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.set(key, value);
            });

            router.push(`?${params.toString()}`, { scroll: false });
        },
        [router]
    );

    return { getFilter, setFilters, searchParams };
};
