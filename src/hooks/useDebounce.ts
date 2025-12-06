import { useState, useEffect } from "react";

/**
 * Hook para aplicar debounce a un valor
 * @param value - El valor a aplicar debounce
 * @param delay - El tiempo de espera en milisegundos (default: 1000ms)
 * @returns El valor con debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number = 1000): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Establecer un timeout para actualizar el valor después del delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Limpiar el timeout si el valor cambia antes de que se cumpla el delay
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
