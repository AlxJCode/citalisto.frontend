"use client";

import { useState } from "react";
import { Card, Calendar, Badge, Typography } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { ProfessionalAvailabilityException } from "@/features/schedules/availability-exception/types/professional-availability-exception.types";
import { AddExceptionModal } from "../AddExceptionModal";

const { Text } = Typography;

interface AvailabilityCalendarProps {
    professionalId: number;
    exceptions: ProfessionalAvailabilityException[];
    onExceptionCreated: () => void;
}

export const AvailabilityCalendar = ({ professionalId, exceptions, onExceptionCreated }: AvailabilityCalendarProps) => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const dateCellRender = (value: Dayjs) => {
        const dateStr = value.format("YYYY-MM-DD");
        const dayExceptions = exceptions.filter((e) => e.date === dateStr);

        return (
            <div style={{ minHeight: 24 }}>
                {dayExceptions.map((exception) => (
                    <Badge
                        key={exception.id}
                        status={exception.status === "available" ? "success" : "error"}
                        text={
                            <Text style={{ fontSize: 12 }}>
                                {exception.status === "available" ? "Disp" : "Bloq"}
                            </Text>
                        }
                    />
                ))}
            </div>
        );
    };

    return (
        <Card
            title="Calendario de Excepciones"
            extra={
                <AddExceptionModal
                    professionalId={professionalId}
                    selectedDate={selectedDate}
                    onSuccess={onExceptionCreated}
                />
            }
            style={{ marginBottom: 24 }}
        >
            <Calendar
                fullscreen={false}
                cellRender={dateCellRender}
                value={selectedDate || dayjs()}
                onSelect={setSelectedDate}
            />
        </Card>
    );
};
