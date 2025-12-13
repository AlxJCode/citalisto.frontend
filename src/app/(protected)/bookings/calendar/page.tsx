"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Calendar } from "@/components/calendar";
import { Card, Space } from "antd";
import { CreateBookingModal } from "@/features/appointments/booking/components/CreateBookingModal";
import { CreateHistoricalBookingModal } from "@/features/appointments/booking/components/CreateHistoricalBookingModal";

const CalendarPage = () => {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <PageContainer
            title="Calendario"
            description="Visualiza y gestiona las citas de tu negocio"
            actions={
            <Space>
                <CreateHistoricalBookingModal onSuccess={() => setRefreshKey(prev => prev + 1)}/>
                <CreateBookingModal onSuccess={() => setRefreshKey(prev => prev + 1)} />
            </Space>
            }
        >
            <Card className="p-0">
                <Calendar key={refreshKey} />
            </Card>
        </PageContainer>
    );
};

export default CalendarPage;
