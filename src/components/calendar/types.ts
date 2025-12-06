import { Booking } from "@/features/appointments/booking/types/booking.types";

export interface CalendarEvent {
    id: number;
    start: string; // '2025-12-04T10:00:00'
    end: string;   // '2025-12-04T10:40:00'
    title: string;
    professionalId: number;
    professionalName: string;
    customerName: string;
    serviceName: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    booking: Booking; // Datos completos para el modal
}

export interface TimeSlot {
    time: string; // '09:00'
    label: string; // '9:00 AM'
}

export interface CalendarConfig {
    startHour: number; // 9
    endHour: number;   // 17
    slotInterval: number; // 15 minutos
}
