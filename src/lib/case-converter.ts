// Case conversion utilities
export const toCamelCase = (str: string): string => {
    return str.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace("-", "").replace("_", "");
    });
};

export const toSnakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const toPascalCase = (str: string): string => {
    const camelCase = toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
