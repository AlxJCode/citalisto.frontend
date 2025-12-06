export const normalizeText = (value: string): string => {
    return value
        .normalize("NFD") // separa caracteres + tildes
        .replace(/[\u0300-\u036f]/g, "") // elimina tildes
        .toLowerCase() // opcional
        .trim();
};
