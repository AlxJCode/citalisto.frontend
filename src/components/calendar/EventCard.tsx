import { CalendarEvent } from "./types";
import dayjs from "dayjs";

interface EventCardProps {
    event: CalendarEvent;
    onClick: (event: CalendarEvent) => void;
}

const statusColors = {
    pending: {
        border: "#faad14",    // warning (amarillo)
        bg: "#fffbf0",        // amarillo muy claro
    },
    confirmed: {
        border: "#1890ff",    // processing (azul)
        bg: "#f0f5ff",        // azul muy claro
    },
    completed: {
        border: "#52c41a",    // success (verde)
        bg: "#f6ffed",        // verde muy claro
    },
    cancelled: {
        border: "#ff4d4f",    // error (rojo)
        bg: "#fff1f0",        // rojo muy claro
    },
};

export const EventCard = ({ event, onClick }: EventCardProps) => {
    const startTime = dayjs(event.start).format("HH:mm");
    const endTime = dayjs(event.end).format("HH:mm");
    const colors = statusColors[event.status];

    return (
        <div
            onClick={() => onClick(event)}
            className="absolute inset-x-0.5 md:inset-x-1 inset-y-0.5 rounded-md p-1 md:p-2 cursor-pointer hover:shadow-lg transition-shadow border overflow-hidden"
            style={{
                zIndex: 1,
                borderLeftWidth: "3px",
                borderLeftColor: colors.border,
                borderColor: `${colors.border}20`, // border con 20% de opacidad
                backgroundColor: colors.bg,
            }}
        >
            <div className="text-[10px] md:text-xs font-medium text-gray-900 truncate mb-0.5">
                {startTime} - {endTime}
            </div>
            <div className="text-[10px] md:text-xs font-semibold text-gray-700 truncate mb-0.5">
                {event.customerName}
            </div>
            <div className="text-[10px] md:text-xs text-gray-500 truncate">
                {event.serviceName}
            </div>
            <div className="hidden md:block text-xs text-gray-500 truncate">
                {`Por: ${event.professionalName}`}
            </div>
        </div>
    );
};
