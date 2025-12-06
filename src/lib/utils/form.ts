import { FormInstance } from "antd";

/**
 * Setea errores de validación del backend en los campos del formulario
 * @param form - Instancia del formulario de Ant Design
 * @param errorFields - Objeto con los errores por campo del backend
 */
export const setBackendErrors = (
    form: FormInstance,
    errorFields: Record<string, string[]>
) => {
    form.setFields(
        Object.entries(errorFields).map(([name, errors]) => ({
            name,
            errors,
        }))
    );
};
