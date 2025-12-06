// Convierte una key snake_case a camelCase
const toCamel = (str: string) =>
    str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

// Convierte un objeto completo recursivamente
export function toCamelCase<T extends Record<string, any>>(obj: T): any {
    if (Array.isArray(obj)) {
        return obj.map(item => toCamelCase(item));
    }

    if (obj !== null && typeof obj === "object") {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            const newKey = toCamel(key);
            acc[newKey] = toCamelCase(value);
            return acc;
        }, {} as Record<string, any>);
    }

    return obj;
}
