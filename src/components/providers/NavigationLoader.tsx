"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoader } from "@/providers/LoaderProvider";

/**
 * Component that shows/hides loader on route changes
 * Equivalent to Router.events in Pages Router
 */
export function NavigationLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { hideLoader } = useLoader();

    useEffect(() => {
        // Hide loader when navigation completes
        hideLoader();
    }, [pathname, searchParams, hideLoader]);

    return null;
}
