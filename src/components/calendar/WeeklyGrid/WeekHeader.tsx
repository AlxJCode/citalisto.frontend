import dayjs from "dayjs";

interface WeekHeaderProps {
    weekDays: dayjs.Dayjs[];
}

export const WeekHeader = ({ weekDays }: WeekHeaderProps) => {
    const today = dayjs().format("YYYY-MM-DD");

    return (
        <div className="grid grid-cols-[60px_repeat(7,1fr)] md:grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 bg-gray-50">
            {/* Columna vacía para alinear con las horas */}
            <div className="border-r border-gray-200" />

            {/* Encabezados de días */}
            {weekDays.map((day) => {
                const isToday = day.format("YYYY-MM-DD") === today;
                return (
                    <div
                        key={day.format("YYYY-MM-DD")}
                        className={`text-center py-2 md:py-3 border-r border-gray-200 last:border-r-0 ${
                            isToday ? "bg-blue-50" : ""
                        }`}
                    >
                        <div className="text-[10px] md:text-xs text-gray-500 uppercase">
                            {day.format("ddd")}
                        </div>
                        <div
                            className={`text-sm md:text-lg font-semibold mt-0.5 md:mt-1 ${
                                isToday ? "text-blue-600" : "text-gray-900"
                            }`}
                        >
                            {day.format("D")}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
