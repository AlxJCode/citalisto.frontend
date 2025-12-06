"use client";

import { useState, useEffect } from "react";
import { Calendar, Button, Card, Space, Typography, Alert } from "antd";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;

/* -----------------------------------------------------------------------
 * 1️⃣ MOCK DATA – SIMULAMOS WEEKLY Y EXCEPTIONS
 * ----------------------------------------------------------------------- */

// Weekly schedule: 0=Lunes ... 6=Domingo
const WEEKLY_AVAILABILITY = [
    {
        dayOfWeek: 0,
        start: "09:00",
        end: "13:00",
        breakStart: "11:00",
        breakEnd: "11:30",
    },
    {
        dayOfWeek: 2,
        start: "10:00",
        end: "16:00",
        breakStart: null,
        breakEnd: null,
    },
    {
        dayOfWeek: 4,
        start: "14:00",
        end: "20:00",
    },
];

// Exceptions para fechas específicas
const EXCEPTIONS = [
    {
        date: "2025-12-02",
        status: "unavailable", // todo el día bloqueado
    },
    {
        date: "2025-12-05",
        status: "available",
        start: "15:00",
        end: "19:00",
        breakStart: null,
        breakEnd: null,
    },
];

/* -----------------------------------------------------------------------
 * 2️⃣ UTILIDADES MVP
 * ----------------------------------------------------------------------- */

const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

const generateSlots = (start: string, end: string, slot = 30) => {
    const result = [];
    let cursor = toMinutes(start);
    const endMin = toMinutes(end);

    while (cursor + slot <= endMin) {
        const sH = String(Math.floor(cursor / 60)).padStart(2, "0");
        const sM = String(cursor % 60).padStart(2, "0");

        const e = cursor + slot;
        const eH = String(Math.floor(e / 60)).padStart(2, "0");
        const eM = String(e % 60).padStart(2, "0");

        result.push({
            startTime: `${sH}:${sM}`,
            endTime: `${eH}:${eM}`,
        });

        cursor += slot;
    }

    return result;
};

const generateSlotsWithBreak = (start: string, end: string, bStart: string | null, bEnd: string | null) => {
    if (!bStart || !bEnd) return generateSlots(start, end);

    return [
        ...generateSlots(start, bStart),
        ...generateSlots(bEnd, end),
    ];
};

/* -----------------------------------------------------------------------
 * 3️⃣ LOGICA PRINCIPAL (sin backend)
 * ----------------------------------------------------------------------- */

const getAvailabilityForDate = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");

    // buscar excepción
    const exception = EXCEPTIONS.find(e => e.date === dateStr);

    if (exception) {
        if (exception.status === "unavailable") {
            return {
                source: "exception_unavailable",
                slots: [],
            };
        }

        if (exception.start && exception.end) {
            return {
                source: "exception",
                slots: generateSlotsWithBreak(
                    exception.start,
                    exception.end,
                    exception.breakStart ?? null,
                    exception.breakEnd ?? null
                ),
            };
        }

        // excepción sin horario definido
        return {
            source: "exception_invalid",
            slots: [],
        };
    }

    // buscar weekly
    const weekly = WEEKLY_AVAILABILITY.find(w => w.dayOfWeek === date.day());

    if (!weekly) {
        return { source: "no_weekly", slots: [] };
    }

    const slots = generateSlotsWithBreak(
        weekly.start,
        weekly.end,
        weekly.breakStart ?? null,
        weekly.breakEnd ?? null
    );

    return {
        source: "weekly",
        slots,
    };
};

/* -----------------------------------------------------------------------
 * 4️⃣ COMPONENTE FINAL – MVP COMPLETO
 * ----------------------------------------------------------------------- */

export const AvailabilityMVP = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [availability, setAvailability] = useState<{ source: string; slots: any[] }>({
        source: "",
        slots: [],
    });

    useEffect(() => {
        setAvailability(getAvailabilityForDate(selectedDate));
    }, [selectedDate]);

    return (
        <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* ----------------------------- CALENDARIO ----------------------------- */}
            <Card>
                <Title level={4}>Calendario de Atención</Title>
                <Calendar
                    fullscreen={false}
                    value={selectedDate}
                    onSelect={setSelectedDate}
                />
            </Card>

            {/* ----------------------------- HORARIOS ------------------------------- */}
            <Card>
                <Title level={4}>
                    Horarios para el {selectedDate.format("DD/MM/YYYY")}
                </Title>

                {/* Fuente */}
                <Text type="secondary">
                    Fuente:{" "}
                    {availability.source === "weekly" && "Disponibilidad semanal"}
                    {availability.source === "exception" && "Excepción del día"}
                    {availability.source === "exception_unavailable" && "Día bloqueado por excepción"}
                    {availability.source === "no_weekly" && "Sin disponibilidad semanal configurada"}
                    {availability.source === "exception_invalid" && "Excepción sin horario válido"}
                </Text>

                {/* Estado sin slots */}
                {!availability.slots.length && (
                    <Alert
                        style={{ marginTop: 16 }}
                        type="info"
                        message="No hay horarios disponibles en este día."
                        showIcon
                    />
                )}

                {/* Lista de slots */}
                <Space wrap style={{ marginTop: 20 }}>
                    {availability.slots.map((slot, i) => (
                        <Button key={i} type="default">
                            {slot.startTime} – {slot.endTime}
                        </Button>
                    ))}
                </Space>
            </Card>
        </div>
    );
};
