"use client";

import { useEffect } from "react";
import { useLoader } from "@/providers/LoaderProvider";

/**
 * Intercepts Link clicks and router.push calls to show loader
 */
export function LinkInterceptor() {
    const { showLoader } = useLoader();

    useEffect(() => {
        // Intercept all link clicks
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");

            if (link && link.href) {
                // Check if it's an internal link
                const isInternal = link.href.startsWith(window.location.origin);
                const isNewTab = link.target === "_blank";
                const isDownload = link.hasAttribute("download");

                // Only show loader for internal navigation
                if (isInternal && !isNewTab && !isDownload) {
                    showLoader();
                }
            }
        };

        // Intercept form submissions
        const handleSubmit = (e: SubmitEvent) => {
            const form = e.target as HTMLFormElement;
            const action = form.action;

            // Check if it's an internal form submission
            if (action && action.startsWith(window.location.origin)) {
                showLoader("Procesando...");
            }
        };

        document.addEventListener("click", handleClick, true);
        //document.addEventListener("submit", handleSubmit, true);

        return () => {
            document.removeEventListener("click", handleClick, true);
            //document.removeEventListener("submit", handleSubmit, true);
        };
    }, [showLoader]);

    return null;
}
