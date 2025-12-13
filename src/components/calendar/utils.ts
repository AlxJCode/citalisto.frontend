import dayjs from "dayjs";
import { TimeSlot, CalendarEvent, CalendarConfig } from "./types";
import { Booking } from "@/features/appointments/booking/types/booking.types";

/**
 * Genera los slots de tiempo para la vista diaria
 */
export const generateTimeSlots = (config: CalendarConfig): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const { startHour, endHour, slotInterval } = config;

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let min = 0; min < 60; min += slotInterval) {
            const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
            const label = dayjs(`2000-01-01 ${time}`).format("h:mm A");
            slots.push({ time, label });
        }
    }

    return slots;
};

/**
 * Calcula la posición y altura de un evento en píxeles
 * @param event - Evento del calendario
 * @param config - Configuración del calendario
 * @param pixelsPerMinute - Píxeles por minuto (default: 1)
 */
export const calculateEventPosition = (
    event: CalendarEvent,
    config: CalendarConfig,
    pixelsPerMinute = 1
): { top: number; height: number } => {
    const startTime = dayjs(event.start);
    const endTime = dayjs(event.end);

    // Calcular minutos desde el inicio del día laboral
    const startOfDay = dayjs(event.start).hour(config.startHour).minute(0).second(0);
    const minutesFromStart = startTime.diff(startOfDay, "minute");

    // Calcular duración en minutos
    const duration = endTime.diff(startTime, "minute");

    const result = {
        top: minutesFromStart * pixelsPerMinute,
        height: duration * pixelsPerMinute,
    };

    return result;
};

/**
 * Convierte un Booking en un CalendarEvent
 */
export const bookingToCalendarEvent = (booking: Booking): CalendarEvent => {
    // Asegurar formato correcto de fecha/hora
    const startTime = booking.startTime.substring(0, 5); // "HH:mm" desde "HH:mm:ss"
    const endTime = booking.endTime.substring(0, 5);     // "HH:mm" desde "HH:mm:ss"

    const start = `${booking.date}T${startTime}:00`;
    const end = `${booking.date}T${endTime}:00`;

    return {
        id: booking.id,
        start,
        end,
        title: booking.serviceModel?.name || "Sin servicio",
        professionalId: booking.professional,
        professionalName: booking.professionalModel
            ? `${booking.professionalModel.name} ${booking.professionalModel.lastName}`
            : "Sin profesional",
        customerName: booking.customerModel
            ? `${booking.customerModel.name} ${booking.customerModel.lastName}`
            : "Sin cliente",
        serviceName: booking.serviceModel?.name || "Sin servicio",
        status: booking.status,
        booking,
    };
};

/**
 * Agrupa eventos por día (útil para vista semanal futura)
 */
export const groupEventsByDay = (events: CalendarEvent[]): Record<string, CalendarEvent[]> => {
    return events.reduce((acc, event) => {
        const day = dayjs(event.start).format("YYYY-MM-DD");
        if (!acc[day]) acc[day] = [];
        acc[day].push(event);
        return acc;
    }, {} as Record<string, CalendarEvent[]>);
};

/**
 * Obtiene los 7 días de la semana empezando por el lunes (1) y terminando en domingo (0)
 */
export const getWeekDays = (date: dayjs.Dayjs): dayjs.Dayjs[] => {
    // Obtener el lunes de la semana actual
    // day() retorna: 0=domingo, 1=lunes, 2=martes... 6=sábado
    const currentDay = date.day();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // Si es domingo (0), restar 6 días
    const monday = date.subtract(daysFromMonday, "day");

    return Array.from({ length: 7 }, (_, i) => monday.add(i, "day"));
};

export interface EventWithPosition {
    event: CalendarEvent;
    columnIndex: number;
    totalColumns: number;
}

/**
 * Calcula posiciones para eventos superpuestos (divide el ancho)
 */
export const calculateEventPositions = (events: CalendarEvent[]): EventWithPosition[] => {
    const result: EventWithPosition[] = [];

    events.forEach((event, index) => {
        const eventStart = dayjs(event.start);
        const eventEnd = dayjs(event.end);

        // Encontrar todos los eventos que se superponen con este
        const overlapping = events.filter((other, otherIndex) => {
            if (index === otherIndex) return true;
            const otherStart = dayjs(other.start);
            const otherEnd = dayjs(other.end);
            return eventStart.isBefore(otherEnd) && eventEnd.isAfter(otherStart);
        });

        const totalColumns = overlapping.length;
        const columnIndex = overlapping.findIndex(e => e.id === event.id);

        result.push({ event, columnIndex, totalColumns });
    });

    return result;
};
