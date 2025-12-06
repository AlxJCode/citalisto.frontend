"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Calendar } from "@/components/calendar";
import { Card } from "antd";
import { CreateBookingModal } from "@/features/appointments/booking/components/CreateBookingModal";

const CalendarPage = () => {
    return (
        <PageContainer
            title="Calendario"
            description="Visualiza y gestiona las citas de tu negocio"
            actions={<CreateBookingModal/>}
        >
            <Card className="p-0">
                <Calendar />
            </Card>
        </PageContainer>
    );
};

export default CalendarPage;
