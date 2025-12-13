"use client";

import dayjs from "dayjs";
import { CalendarEvent, CalendarConfig } from "./types";
import { generateTimeSlots, calculateEventPosition, calculateEventPositions } from "./utils";
import { EventCard } from "./EventCard";
import { CurrentTimeLine } from "./CurrentTimeLine";

interface DailyGridProps {
    events: CalendarEvent[];
    config: CalendarConfig;
    onEventClick: (event: CalendarEvent) => void;
    onSlotClick: (time: string) => void;
    currentDate: dayjs.Dayjs;
}

const PIXELS_PER_MINUTE = 1.2;

export const DailyGrid = ({
    events,
    config,
    onEventClick,
    onSlotClick,
    currentDate,
}: DailyGridProps) => {
    const timeSlots = generateTimeSlots(config);
    const slotHeightInPixels = config.slotInterval * PIXELS_PER_MINUTE;
    const today = dayjs().format("YYYY-MM-DD");
    const isToday = currentDate.format("YYYY-MM-DD") === today;

    return (
        <div className="border border-gray-200 rounded-lg">
            {/* Header del día - sticky */}
            <div className="sticky top-0 z-20 bg-white shadow-sm">
                <div
                    className={`border-b border-gray-200 py-2 md:py-3 text-center ${
                        isToday ? "bg-blue-50" : "bg-gray-50"
                    }`}
                >
                    <div className="text-[10px] md:text-xs text-gray-500 uppercase">
                        {currentDate.format("dddd")}
                    </div>
                    <div
                        className={`text-sm md:text-lg font-semibold mt-0.5 md:mt-1 ${
                            isToday ? "text-blue-600" : "text-gray-900"
                        }`}
                    >
                        {currentDate.format("D [de] MMMM YYYY")}
                    </div>
                </div>
            </div>

            {/* Grid del día */}
            <div className="flex bg-white relative">
                {/* Columna de horas - sticky horizontal */}
                <div className="w-16 md:w-20 flex-shrink-0 sticky left-0 z-10 bg-white border-r border-gray-200">
                    {timeSlots.map((slot, index) => (
                        <div
                            key={slot.time}
                            className="text-[10px] md:text-xs text-gray-500 text-right pr-1.5 md:pr-3 border-b border-gray-100 bg-white"
                            style={{ height: `${slotHeightInPixels}px` }}
                        >
                            {index % (60 / config.slotInterval) === 0 && (
                                <span className="inline-block -mt-2">{slot.label}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Columna de eventos */}
                <div className="flex-1 relative">
                    {/* Slots clickeables */}
                    {timeSlots.map((slot) => (
                        <div
                            key={slot.time}
                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                            style={{ height: `${slotHeightInPixels}px` }}
                            onClick={() => onSlotClick(slot.time)}
                        />
                    ))}

                    {/* Eventos posicionados absolutamente */}
                    {calculateEventPositions(events).map(({ event, columnIndex, totalColumns }) => {
                        const { top, height } = calculateEventPosition(event, config, PIXELS_PER_MINUTE);
                        const widthPercent = 100 / totalColumns;
                        const leftPercent = widthPercent * columnIndex;

                        return (
                            <div
                                key={event.id}
                                className="absolute"
                                style={{
                                    top: `${top}px`,
                                    height: `${height}px`,
                                    left: `${leftPercent}%`,
                                    width: `${widthPercent}%`,
                                }}
                            >
                                <EventCard event={event} onClick={onEventClick} />
                            </div>
                        );
                    })}
                </div>

                {/* Línea de tiempo actual que cruza todo el ancho (solo si es hoy) */}
                {isToday && (
                    <CurrentTimeLine
                        pixelsPerMinute={PIXELS_PER_MINUTE}
                        startHour={config.startHour}
                    />
                )}
            </div>
        </div>
    );
};
