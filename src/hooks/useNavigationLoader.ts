import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Hook to detect navigation events
 * Returns callbacks that fire on navigation start and complete
 */
export function useNavigationLoader(
    onStart?: () => void,
    onComplete?: () => void
) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Navigation completed
        if (onComplete) {
            onComplete();
        }
    }, [pathname, searchParams, onComplete]);

    return { pathname, searchParams };
}
