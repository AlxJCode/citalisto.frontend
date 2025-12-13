import dayjs from "dayjs";
import { CalendarEvent, CalendarConfig, TimeSlot } from "../types";
import { generateTimeSlots, groupEventsByDay, getWeekDays } from "../utils";
import { WeekHeader } from "./WeekHeader";
import { WeekColumn } from "./WeekColumn";
import { CurrentTimeLine } from "../CurrentTimeLine";

interface WeeklyGridProps {
    events: CalendarEvent[];
    config: CalendarConfig;
    currentDate: dayjs.Dayjs;
    onEventClick: (event: CalendarEvent) => void;
    onSlotClick: (date: string, time: string) => void;
}

const PIXELS_PER_MINUTE = 1.2;

export const WeeklyGrid = ({
    events,
    config,
    currentDate,
    onEventClick,
    onSlotClick,
}: WeeklyGridProps) => {
    const weekDays = getWeekDays(currentDate);
    const timeSlots = generateTimeSlots(config);
    const slotHeightInPixels = config.slotInterval * PIXELS_PER_MINUTE;
    const eventsByDay = groupEventsByDay(events);
    const today = dayjs().format("YYYY-MM-DD");
    const isCurrentWeek = weekDays.some(day => day.format("YYYY-MM-DD") === today);

    return (
        <div className="border border-gray-200 rounded-lg">
            {/* Encabezado de la semana - sticky */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
                <WeekHeader weekDays={weekDays} />
            </div>

            {/* Grid de la semana */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] md:grid-cols-[80px_repeat(7,1fr)] bg-white relative">
                {/* Columna de horas - sticky horizontal */}
                <div className="sticky left-0 z-10 bg-white border-r border-gray-200">
                    {timeSlots.map((slot: TimeSlot, index: number) => (
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

                {/* Columnas de días */}
                {weekDays.map((day) => {
                    const dateKey = day.format("YYYY-MM-DD");
                    const dayEvents = eventsByDay[dateKey] || [];

                    return (
                        <WeekColumn
                            key={dateKey}
                            events={dayEvents}
                            config={config}
                            slotHeightInPixels={slotHeightInPixels}
                            onEventClick={onEventClick}
                            onSlotClick={onSlotClick}
                            date={dateKey}
                        />
                    );
                })}

                {/* Línea de tiempo actual que cruza toda la semana (solo si la semana actual) */}
                {isCurrentWeek && (
                    <CurrentTimeLine
                        pixelsPerMinute={PIXELS_PER_MINUTE}
                        startHour={config.startHour}
                    />
                )}
            </div>
        </div>
    );
};
