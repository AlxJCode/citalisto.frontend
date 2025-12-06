"use client";

import { Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

interface BookingsSummaryProps {
    count: number;
    filters: Record<string, any>;
}

const statusLabels: Record<string, string> = {
    pending: "pendientes",
    confirmed: "confirmadas",
    cancelled: "canceladas",
    completed: "completadas",
};

export const BookingsSummary = ({ count, filters }: BookingsSummaryProps) => {
    const dateRange = filters?.filter?.date__range;
    const status = filters?.filter?.status;
    const today = dayjs().format("YYYY-MM-DD");

    // Verificar si es el día de hoy
    const isToday = dateRange &&
                    dateRange[0] === today &&
                    dateRange[1] === today;

    // Construir mensaje
    let message = "";

    if (isToday) {
        message = `Hay ${count} ${count === 1 ? "cita" : "citas"}`;
        if (status) {
            message += ` ${statusLabels[status] || status}`;
        }
        message += " agendadas para hoy";
    } else {
        message = `Se ${count === 1 ? "encontró" : "encontraron"} ${count} ${count === 1 ? "cita" : "citas"}`;
        if (status) {
            message += ` ${statusLabels[status] || status}`;
        }
    }

    return (
        <Text strong style={{ fontSize: "15px", display: "block" }}>
            <CalendarOutlined style={{ marginRight: 8 }} />
            {message}
        </Text>
    );
};
