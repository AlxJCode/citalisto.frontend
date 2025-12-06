import { CalendarEvent, CalendarConfig } from "../types";
import { calculateEventPosition } from "../utils";
import { EventCard } from "../EventCard";

interface WeekColumnProps {
    events: CalendarEvent[];
    config: CalendarConfig;
    slotHeightInPixels: number;
    onEventClick: (event: CalendarEvent) => void;
    onSlotClick: (date: string, time: string) => void;
    date: string;
}

const PIXELS_PER_MINUTE = 1.2;

export const WeekColumn = ({
    events,
    config,
    slotHeightInPixels,
    onEventClick,
    onSlotClick,
    date,
}: WeekColumnProps) => {
    const totalSlots = ((config.endHour - config.startHour + 1) * 60) / config.slotInterval;

    return (
        <div className="relative border-r border-gray-200 last:border-r-0">
            {/* Slots clickeables */}
            {Array.from({ length: totalSlots }).map((_, index) => {
                const hour = config.startHour + Math.floor((index * config.slotInterval) / 60);
                const minute = (index * config.slotInterval) % 60;
                const time = `${hour.toString().padStart(2, "0")}:${minute
                    .toString()
                    .padStart(2, "0")}`;

                return (
                    <div
                        key={time}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        style={{ height: `${slotHeightInPixels}px` }}
                        onClick={() => onSlotClick(date, time)}
                    />
                );
            })}

            {/* Eventos posicionados absolutamente */}
            {events.map((event) => {
                const { top, height } = calculateEventPosition(event, config, PIXELS_PER_MINUTE);

                return (
                    <div
                        key={event.id}
                        className="absolute"
                        style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <EventCard event={event} onClick={onEventClick} />
                    </div>
                );
            })}
        </div>
    );
};
