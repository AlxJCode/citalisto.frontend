"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";

interface CurrentTimeLineProps {
    pixelsPerMinute: number;
    startHour: number;
}

export const CurrentTimeLine = ({ pixelsPerMinute, startHour }: CurrentTimeLineProps) => {
    const [currentTime, setCurrentTime] = useState(dayjs());

    useEffect(() => {
        // Actualizar cada minuto
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 60000); // 60 segundos

        return () => clearInterval(interval);
    }, []);

    const now = currentTime;
    const hours = now.hour();
    const minutes = now.minute();
    const totalMinutesFromStart = (hours - startHour) * 60 + minutes;
    const topPosition = totalMinutesFromStart * pixelsPerMinute;

    // No mostrar si está fuera del rango de horas
    if (hours < startHour) return null;

    return (
        <div
            className="absolute inset-x-0 z-30 pointer-events-none"
            style={{ top: `${topPosition}px` }}
        >
            {/* Línea horizontal que cruza todo el ancho */}
            <div className="h-0.5 bg-red-500 shadow-sm w-full" />

            {/* Círculo indicador en el extremo izquierdo */}
            <div className="absolute left-0 -top-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md" />

            {/* Etiqueta de hora */}
            <div className="absolute left-4 -top-2.5 bg-red-500 text-white text-xs px-2 py-0.5 rounded shadow-md font-medium">
                {now.format("HH:mm")}
            </div>
        </div>
    );
};
