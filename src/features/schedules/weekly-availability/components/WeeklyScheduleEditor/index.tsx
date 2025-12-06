"use client";

import { useEffect, useState } from "react";
import { Card, Space, Divider, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useWeeklyAvailability } from "@/features/schedules/weekly-availability/hooks/useWeeklyAvailability";
import { DaySchedule, DayOfWeek } from "@/features/schedules/weekly-availability/types/schedule-editor.types";
import { DayScheduleRow } from "./DayScheduleRow";

const DAYS_OF_WEEK: DayOfWeek[] = [
    { id: 0, name: "Lunes" },
    { id: 1, name: "Martes" },
    { id: 2, name: "Miércoles" },
    { id: 3, name: "Jueves" },
    { id: 4, name: "Viernes" },
    { id: 5, name: "Sábado" },
    { id: 6, name: "Domingo" },
];

interface WeeklyScheduleEditorProps {
    professionalId: number;
}

export const WeeklyScheduleEditor = ({ professionalId }: WeeklyScheduleEditorProps) => {
    const [schedule, setSchedule] = useState<Record<number, DaySchedule>>({});
    const [saving, setSaving] = useState<Record<number, boolean>>({});
    const {
        weeklyAvailabilities,
        loading,
        fetchWeeklyAvailabilities,
        updateWeeklyAvailability,
    } = useWeeklyAvailability();

    useEffect(() => {
        if (professionalId) {
            fetchWeeklyAvailabilities({ professional: professionalId });
        }
    }, [professionalId, fetchWeeklyAvailabilities]);

    useEffect(() => {
        // El backend crea automáticamente los 7 días, por lo que siempre deben existir
        if (weeklyAvailabilities.length === 0) return;

        const initialSchedule: Record<number, DaySchedule> = {};

        weeklyAvailabilities.forEach((availability) => {
            initialSchedule[availability.dayOfWeek] = {
                id: availability.id,
                enabled: availability.enabled,
                startTime: availability.startTime ? dayjs(availability.startTime, "HH:mm:ss") : null,
                endTime: availability.endTime ? dayjs(availability.endTime, "HH:mm:ss") : null,
                hasBreak: !!(availability.breakStartTime && availability.breakEndTime),
                breakStartTime: availability.breakStartTime
                    ? dayjs(availability.breakStartTime, "HH:mm:ss")
                    : null,
                breakEndTime: availability.breakEndTime ? dayjs(availability.breakEndTime, "HH:mm:ss") : null,
            };
        });

        setSchedule(initialSchedule);
    }, [weeklyAvailabilities]);

    const handleToggleDay = async (dayId: number, enabled: boolean) => {
        if (!enabled) {
            // Desactivar: hacer UPDATE con enabled=false si existe en backend
            if (schedule[dayId].id) {
                setSaving((prev) => ({ ...prev, [dayId]: true }));

                const formData = {
                    enabled: false,
                };

                const result = await updateWeeklyAvailability(schedule[dayId].id!, formData);
                setSaving((prev) => ({ ...prev, [dayId]: false }));

                if (result.success) {
                    message.success("Día deshabilitado");
                    setSchedule((prev) => ({
                        ...prev,
                        [dayId]: {
                            ...prev[dayId],
                            enabled: false,
                        },
                    }));
                }
            } else {
                // Solo deshabilitar localmente si no había sido guardado
                setSchedule((prev) => ({
                    ...prev,
                    [dayId]: {
                        ...prev[dayId],
                        enabled: false,
                    },
                }));
            }
        } else {
            // Activar: solo preparar campos localmente, NO guardar automáticamente
            setSchedule((prev) => ({
                ...prev,
                [dayId]: {
                    ...prev[dayId],
                    enabled: true,
                    startTime: prev[dayId].startTime || dayjs("09:00", "HH:mm"),
                    endTime: prev[dayId].endTime || dayjs("18:00", "HH:mm"),
                },
            }));
        }
    };

    const handleTimeChange = (
        dayId: number,
        field: "startTime" | "endTime" | "breakStartTime" | "breakEndTime",
        time: Dayjs | null
    ) => {
        setSchedule((prev) => ({
            ...prev,
            [dayId]: { ...prev[dayId], [field]: time },
        }));
    };

    const handleToggleBreak = (dayId: number, hasBreak: boolean) => {
        setSchedule((prev) => ({
            ...prev,
            [dayId]: {
                ...prev[dayId],
                hasBreak,
                breakStartTime: hasBreak ? dayjs("12:00", "HH:mm") : null,
                breakEndTime: hasBreak ? dayjs("13:00", "HH:mm") : null,
            },
        }));
    };

    const handleSaveDay = async (dayId: number) => {
        const daySchedule = schedule[dayId];

        // Validación: debe existir un ID para poder actualizar
        if (!daySchedule.id) {
            message.error("No se puede guardar. El día no tiene un registro en el sistema.");
            return;
        }

        // Validación de campos obligatorios
        if (!daySchedule.startTime || !daySchedule.endTime) {
            message.error("Debes completar el horario de inicio y fin");
            return;
        }

        if (daySchedule.hasBreak && (!daySchedule.breakStartTime || !daySchedule.breakEndTime)) {
            message.error("Debes completar el horario de descanso");
            return;
        }

        setSaving((prev) => ({ ...prev, [dayId]: true }));

        const formData = {
            professional: professionalId,
            day_of_week: dayId,
            start_time: daySchedule.startTime.format("HH:mm:ss"),
            end_time: daySchedule.endTime.format("HH:mm:ss"),
            enabled: true,
            break_start_time:
                daySchedule.hasBreak && daySchedule.breakStartTime
                    ? daySchedule.breakStartTime.format("HH:mm:ss")
                    : null,
            break_end_time:
                daySchedule.hasBreak && daySchedule.breakEndTime
                    ? daySchedule.breakEndTime.format("HH:mm:ss")
                    : null,
        };

        const result = await updateWeeklyAvailability(daySchedule.id, formData);
        if (result.success) {
            message.success("Horario guardado");
            setSchedule((prev) => ({
                ...prev,
                [dayId]: { ...daySchedule, id: result.updatedObject!.id },
            }));
        }

        setSaving((prev) => ({ ...prev, [dayId]: false }));
    };

    if (loading && weeklyAvailabilities.length === 0) {
        return <Card loading />;
    }

    return (
        <Card title="Horario Semanal" style={{ marginBottom: 24 }}>
            <Space orientation="vertical" style={{ width: "100%" }} size="middle">
                {DAYS_OF_WEEK.map((day) => {
                    const daySchedule = schedule[day.id];
                    if (!daySchedule) return null;

                    return (
                        <div key={day.id}>
                            <DayScheduleRow
                                day={day}
                                schedule={daySchedule}
                                saving={saving[day.id] || false}
                                onToggleDay={(enabled) => handleToggleDay(day.id, enabled)}
                                onTimeChange={(field, time) => handleTimeChange(day.id, field, time)}
                                onToggleBreak={(hasBreak) => handleToggleBreak(day.id, hasBreak)}
                                onSave={() => handleSaveDay(day.id)}
                            />
                            {day.id < 6 && <Divider style={{ margin: "14px 0 6px 0" }} />}
                        </div>
                    );
                })}
            </Space>
        </Card>
    );
};
