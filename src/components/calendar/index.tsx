"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Space, Typography, Spin, Modal, Form, Segmented, Select } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "@/lib/dayjs/config";
import { DailyGrid } from "./DailyGrid";
import { WeeklyGrid } from "./WeeklyGrid";
import { CalendarEvent, CalendarConfig } from "./types";
import { bookingToCalendarEvent, getWeekDays } from "./utils";
import { getBookingsApi, mapBookingToApi } from "@/features/appointments/booking/services/booking.api";
import { BookingForm } from "@/features/appointments/booking/components/BookingForm";
import { useBookings } from "@/features/appointments/booking/hooks/useBookings";
import { Booking } from "@/features/appointments/booking/types/booking.types";
import { setBackendErrors } from "@/lib/utils/form";
import { useProfessionals } from "@/features/professionals/professional/hooks/useProfessionals";

const { Title } = Typography;

type ViewMode = "day" | "week";

const DEFAULT_CONFIG: CalendarConfig = {
    startHour: 0,
    endHour: 23,
    slotInterval: 30,
};

const PIXELS_PER_MINUTE = 1.2;

interface CalendarProps {
    professionalId?: number;
}

export const Calendar = ({ professionalId: propProfessionalId }: CalendarProps) => {
    const [viewMode, setViewMode] = useState<ViewMode>("week");
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
    const [form] = Form.useForm();
    const { updateBooking } = useBookings();
    const { professionals, fetchProfessionals, loading: professionalsLoading } = useProfessionals();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Determinar el professionalId a usar
    const professionalId = propProfessionalId || selectedProfessional;

    // Fetch de citas
    const fetchBookings = async () => {
        setLoading(true);

        // En vista semanal, obtener todos los días de la semana
        if (viewMode === "week") {
            const weekDays = getWeekDays(currentDate);
            const allEvents: CalendarEvent[] = [];

            // Fetch para cada día de la semana
            for (const day of weekDays) {
                const result = await getBookingsApi({
                    date: day.format("YYYY-MM-DD"),
                    ...(professionalId && { professional: professionalId }),
                });

                if (result.success) {
                    // Filtrar bookings cancelados
                    const activeBookings = result.data.filter(booking => booking.status !== "cancelled");
                    const dayEvents = activeBookings.map(bookingToCalendarEvent);
                    allEvents.push(...dayEvents);
                }
            }

            setEvents(allEvents);
        } else {
            // Vista diaria
            const result = await getBookingsApi({
                date: currentDate.format("YYYY-MM-DD"),
                ...(professionalId && { professional: professionalId }),
            });

            if (result.success) {
                // Filtrar bookings cancelados
                const activeBookings = result.data.filter(booking => booking.status !== "cancelled");
                const calendarEvents = activeBookings.map(bookingToCalendarEvent);
                setEvents(calendarEvents);
            }
        }

        setLoading(false);
    };

    // Cargar profesionales al montar el componente
    useEffect(() => {
        if (!propProfessionalId) {
            fetchProfessionals({ is_active: true });
        }
    }, [propProfessionalId, fetchProfessionals]);

    // Seleccionar el primer profesional cuando se carguen
    useEffect(() => {
        if (!propProfessionalId && professionals.length > 0 && selectedProfessional === null) {
            setSelectedProfessional(professionals[0].id!);
        }
    }, [professionals, propProfessionalId, selectedProfessional]);

    // Fetch bookings solo cuando hay un profesional seleccionado
    useEffect(() => {
        if (professionalId) {
            fetchBookings();
        }
    }, [currentDate, professionalId, viewMode]);

    // Auto-scroll a la hora actual al cargar o cambiar fecha/vista
    useEffect(() => {
        if (scrollContainerRef.current) {
            const now = dayjs();
            const currentHour = now.hour();
            const currentMinutes = now.minute();

            // Scroll a 1 hora antes de la hora actual para dar contexto
            const scrollHour = Math.max(DEFAULT_CONFIG.startHour, currentHour - 1);
            const scrollPosition = (scrollHour * 60) * PIXELS_PER_MINUTE;

            scrollContainerRef.current.scrollTop = scrollPosition;
        }
    }, [currentDate, viewMode]);

    useEffect(() => {
        if (selectedEvent && isModalOpen) {
            const booking = selectedEvent.booking;
            form.setFieldsValue({
                ...booking,
                date: booking.date ? dayjs(booking.date) : null,
                startTime: booking.startTime ? dayjs(booking.startTime, "HH:mm:ss") : null,
                endTime: booking.endTime ? dayjs(booking.endTime, "HH:mm:ss") : null,
            });
        }
    }, [selectedEvent, isModalOpen, form]);

    const handlePrev = () => {
        const amount = viewMode === "week" ? 7 : 1;
        setCurrentDate(currentDate.subtract(amount, "day"));
    };

    const handleNext = () => {
        const amount = viewMode === "week" ? 7 : 1;
        setCurrentDate(currentDate.add(amount, "day"));
    };

    const handleToday = () => setCurrentDate(dayjs());

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleSlotClick = (dateOrTime: string, time?: string) => {
        // En vista diaria: solo recibe time
        // En vista semanal: recibe date y time
        const date = time ? dateOrTime : currentDate.format("YYYY-MM-DD");
        const slotTime = time || dateOrTime;
        console.log("Slot clicked:", date, slotTime);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        form.resetFields();
    };

    const handleFinish = async (values: Partial<Booking>) => {
        if (!selectedEvent?.booking.id) return;

        setModalLoading(true);

        const preparedValues = {
            ...values,
            date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : undefined,
            startTime: values.startTime ? dayjs(values.startTime).format("HH:mm:ss") : undefined,
            endTime: values.endTime ? dayjs(values.endTime).format("HH:mm:ss") : undefined,
        };

        const formData = mapBookingToApi(preparedValues);
        const result = await updateBooking(selectedEvent.booking.id, formData);

        setModalLoading(false);

        if (!result.success) {
            if (result.errorFields) {
                setBackendErrors(form, result.errorFields);
            }
            return;
        }

        handleModalClose();
        fetchBookings();
    };

    const getHeaderTitle = () => {
        if (viewMode === "week") {
            const weekDays = getWeekDays(currentDate);
            const firstDay = weekDays[0];
            const lastDay = weekDays[6];

            if (firstDay.month() === lastDay.month()) {
                return `${firstDay.format("D")} - ${lastDay.format("D [de] MMMM YYYY")}`;
            } else {
                return `${firstDay.format("D [de] MMM")} - ${lastDay.format("D [de] MMM YYYY")}`;
            }
        }
        return currentDate.format("dddd, D [de] MMMM YYYY");
    };

    return (
        <div>
            {/* Header con navegación - sticky */}
            <div className="sticky top-16 z-10 bg-white border-b border-gray-200 px-3 py-3 md:px-6 md:py-4 mb-4 md:mb-6">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 md:justify-between">
                    <Title level={5} className="m-0 text-center md:text-left text-base md:text-2xl">
                        {getHeaderTitle()}
                    </Title>
                    <Space size="small" className="flex-wrap justify-center">
                        {/* Selector de profesional (solo si no viene por props) */}
                        {!propProfessionalId && (
                            <Select
                                size="small"
                                placeholder="Seleccionar profesional"
                                value={selectedProfessional}
                                onChange={setSelectedProfessional}
                                loading={professionalsLoading}
                                style={{ minWidth: 180 }}
                                showSearch
                                optionFilterProp="children"
                            >
                                {professionals.map((prof) => (
                                    <Select.Option key={prof.id} value={prof.id!}>
                                        {prof.name} {prof.lastName}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                        <Segmented
                            size="small"
                            value={viewMode}
                            onChange={(value) => setViewMode(value as ViewMode)}
                            options={[
                                { label: "Día", value: "day" },
                                { label: "Semana", value: "week" },
                            ]}
                        />
                        <Space size="small">
                            <Button size="small" icon={<LeftOutlined />} onClick={handlePrev} />
                            <Button size="small" onClick={handleToday}>Hoy</Button>
                            <Button size="small" icon={<RightOutlined />} onClick={handleNext} />
                        </Space>
                    </Space>
                </div>
            </div>

            {/* Vista de calendario con scroll */}
            <div className="px-3 md:px-6">
                <Spin spinning={loading}>
                    <div
                        ref={scrollContainerRef}
                        className="h-[calc(100vh-280px)] md:h-[calc(100vh-300px)] overflow-y-auto overflow-x-auto"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {viewMode === "day" ? (
                            <DailyGrid
                                events={events}
                                config={DEFAULT_CONFIG}
                                currentDate={currentDate}
                                onEventClick={handleEventClick}
                                onSlotClick={handleSlotClick}
                            />
                        ) : (
                            <div className="min-w-[800px]">
                                <WeeklyGrid
                                    events={events}
                                    config={DEFAULT_CONFIG}
                                    currentDate={currentDate}
                                    onEventClick={handleEventClick}
                                    onSlotClick={handleSlotClick}
                                />
                            </div>
                        )}
                    </div>
                </Spin>
            </div>

            {/* Modal de edición */}
            <Modal
                title="Editar Cita"
                open={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width="64rem"
                destroyOnHidden
                centered
            >
                <BookingForm
                    form={form}
                    onFinish={handleFinish}
                    loading={modalLoading}
                    onCancel={handleModalClose}
                    mode="edit"
                />
            </Modal>
        </div>
    );
};
