import { CalendarEvent } from "./types";
import dayjs from "dayjs";

interface EventCardProps {
    event: CalendarEvent;
    onClick: (event: CalendarEvent) => void;
}

const statusBorderColors = {
    pending: "#faad14",    // warning
    confirmed: "#1890ff",  // processing
    completed: "#52c41a",  // success
    cancelled: "#ff4d4f",  // error
};

export const EventCard = ({ event, onClick }: EventCardProps) => {
    const startTime = dayjs(event.start).format("HH:mm");
    const endTime = dayjs(event.end).format("HH:mm");

    return (
        <div
            onClick={() => onClick(event)}
            className="absolute inset-x-0.5 md:inset-x-1 inset-y-0.5 rounded-md p-1 md:p-2 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200 bg-white overflow-hidden"
            style={{
                zIndex: 1,
                borderLeftWidth: "3px",
                borderLeftColor: statusBorderColors[event.status],
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
