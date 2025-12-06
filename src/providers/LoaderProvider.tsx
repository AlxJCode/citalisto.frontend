"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

interface LoaderContextType {
    isLoading: boolean;
    showLoader: (text?: string) => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loaderText, setLoaderText] = useState<string>("Cargando...");

    const showLoader = useCallback((text?: string) => {
        if (text) setLoaderText(text);
        setIsLoading(true);
    }, []);

    const hideLoader = useCallback(() => {
        setIsLoading(false);
        // Reset text after animation completes
        setTimeout(() => setLoaderText("Cargando..."), 300);
    }, []);

    return (
        <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
            <GlobalLoader isVisible={isLoading} text={loaderText} />
        </LoaderContext.Provider>
    );
};

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (context === undefined) {
        throw new Error("useLoader must be used within a LoaderProvider");
    }
    return context;
};
