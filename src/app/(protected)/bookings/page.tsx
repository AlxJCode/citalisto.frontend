"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { BookingsList } from "@/features/appointments/booking/components/BookingsList";
import { AddBookingModal } from "@/features/appointments/booking/components/AddBookingModal";
import { useBookings } from "@/features/appointments/booking/hooks/useBookings";
import { Card, Space, Flex } from "antd";
import { useEffect, useState } from "react";
import { BookingFilters } from "@/features/appointments/booking/components/BookingFilters";
import { BookingsSummary } from "@/features/appointments/booking/components/BookingsSummary";

const BookingsPage = () => {
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const { loading, bookings, count, fetchFilteredBookings } = useBookings();

    useEffect(() => {
        fetchFilteredBookings(filters, page);
    }, [filters, page]);

    const handleFiltersChange = (newFilters: Record<string, any>) => {
        setFilters(newFilters);
        setPage(1);
    };

    const refetch = () => fetchFilteredBookings(filters, page);

    return (
        <PageContainer
            title="Gestionar Citas"
            description="Administra las citas de tu negocio"
            actions={<AddBookingModal onSuccess={refetch} />}
        >
            <Flex vertical gap={8}>
                <Card>
                    <Space direction="vertical" style={{ width: "100%" }} size={16}>
                        <BookingFilters onFiltersChange={handleFiltersChange} />
                        <BookingsSummary count={count} filters={filters} />
                        <BookingsList
                            count={count}
                            page={page}
                            setPage={setPage}
                            onRefetch={refetch}
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
