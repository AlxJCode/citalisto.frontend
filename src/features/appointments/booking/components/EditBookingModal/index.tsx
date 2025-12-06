"use client";

import { useState, useEffect } from "react";
import { Button, ButtonProps, Modal, Tooltip, Form } from "antd";
import { BookingForm } from "../BookingForm";
import { Booking } from "../../types/booking.types";
import { useBookings } from "../../hooks/useBookings";
import { mapBookingToApi } from "../../services/booking.api";
import { EditOutlined } from "@ant-design/icons";
import { setBackendErrors } from "@/lib/utils/form";
import dayjs from "dayjs";

interface EditBookingModalProps {
    booking: Booking | null;
    onSuccess?: () => void;
    size?: ButtonProps["size"];
}

export const EditBookingModal = ({
    booking,
    onSuccess,
    size = "middle",
}: EditBookingModalProps) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const { updateBooking } = useBookings();

    useEffect(() => {
        if (booking && open) {
            // Convertir datos del backend al formato del form
            form.setFieldsValue({
                ...booking,
                date: booking.date ? dayjs(booking.date) : null,
                startTime: booking.startTime ? dayjs(booking.startTime, "HH:mm:ss") : null,
                endTime: booking.endTime ? dayjs(booking.endTime, "HH:mm:ss") : null,
            });
        }
    }, [booking, open, form]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        form.resetFields();
        setOpen(false);
    };

    const handleFinish = async (values: Partial<Booking>) => {
        if (!booking?.id) return;

        setLoading(true);

        // Preparar datos para enviar
        const preparedValues = {
            ...values,
            date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : undefined,
            startTime: values.startTime ? dayjs(values.startTime).format("HH:mm:ss") : undefined,
            endTime: values.endTime ? dayjs(values.endTime).format("HH:mm:ss") : undefined,
        };

        const formData = mapBookingToApi(preparedValues);
        const result = await updateBooking(booking.id, formData);

        setLoading(false);

        if (!result.success) {
            if (result.errorFields) {
                setBackendErrors(form, result.errorFields);
            }
            return;
        }

        handleClose();
        onSuccess?.();
    };

    return (
        <>
            <Tooltip title="Editar Cita">
                <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={handleOpen}
                    size={size}
                />
            </Tooltip>
            <Modal
                title="Editar Cita"
                open={open}
                onCancel={handleClose}
                footer={null}
                width="64rem"
                destroyOnHidden
                centered
            >
                <BookingForm
                    form={form}
                    onFinish={handleFinish}
                    loading={loading}
                    onCancel={handleClose}
                    mode="edit"
                />
            </Modal>
        </>
    );
};
