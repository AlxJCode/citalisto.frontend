// Configuración general de la aplicación

// WhatsApp Admin
export const WHATSAPP_ADMIN = '+51918957307';

// URL base de WhatsApp
export const getWhatsAppURL = (phoneNumber: string, message?: string) => {
    const encodedMessage = message ? encodeURIComponent(message) : '';
    return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}${message ? `?text=${encodedMessage}` : ''}`;
};
