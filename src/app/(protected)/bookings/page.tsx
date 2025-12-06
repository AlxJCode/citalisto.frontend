"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { BookingsList } from "@/features/appointments/booking/components/BookingsList";
import { AddBookingModal } from "@/features/appointments/booking/components/AddBookingModal";
import { useBookings } from "@/features/appointments/booking/hooks/useBookings";
import { Card, Space, Flex, Divider } from "antd";
import { useEffect, useState } from "react";
import { BookingFilters } from "@/features/appointments/booking/components/BookingFilters";
import { BookingsSummary } from "@/features/appointments/booking/components/BookingsSummary";
import { BookingFilters as BookingFiltersProps } from "@/features/appointments/booking/services/booking.api";

const BookingsPage = () => {
    const [page, setPage] = useState(1);
    const [changes, setChanges] = useState(false);
    const [filters, setFilters] = useState<Record<string, any>>({ });
    const { loading, bookings, count, fetchFilteredBookings } = useBookings();

    useEffect(() => {
        fetchFilteredBookings(filters, page);
    }, [page, changes, filters]);

    const handleFiltersChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
        setPage(1);
    };

    return (
        <PageContainer
            title="Gestionar Citas"
            description="Administra las citas de tu negocio"
            actions={
                <Space wrap>
                    <AddBookingModal />
                </Space>
            }
        >
            <Flex vertical gap={8}>
                <Card>
                    <Space orientation="vertical" style={{width: "100%"}} size={16}>
                        <BookingFilters onFiltersChange={handleFiltersChange}
                            setPage={setPage}
                        />
                        <BookingsSummary count={count} filters={filters} />
                        <BookingsList
                            count={count}
                            page={page}
                            setPage={setPage}
                            setChanges={setChanges}
                            loading={loading}
                            dataSource={bookings}
                        />
                    </Space>
                </Card>
            </Flex>
        </PageContainer>
    );
};

export default BookingsPage;
