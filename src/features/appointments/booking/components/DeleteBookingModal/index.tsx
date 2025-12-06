"use client";

import { Button, Modal } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useBookings } from "../../hooks/useBookings";
import { Booking } from "../../types/booking.types";
import dayjs from "dayjs";

interface DeleteBookingModalProps {
    booking: Booking;
    onSuccess?: () => void;
}

export const DeleteBookingModal = ({ booking, onSuccess }: DeleteBookingModalProps) => {
    const { deleteBooking } = useBookings();

    const handleDelete = () => {
        Modal.confirm({
            title: "¿Eliminar cita?",
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>¿Estás seguro de que deseas eliminar esta cita?</p>
                    <ul style={{ marginTop: 12, paddingLeft: 20 }}>
                        <li>
                            <strong>Cliente:</strong>{" "}
                            {booking.customerModel
                                ? `${booking.customerModel.name} ${booking.customerModel.lastName}`
                                : "N/A"}
                        </li>
                        <li>
                            <strong>Servicio:</strong>{" "}
                            {booking.serviceModel?.name || "N/A"}
                        </li>
                        <li>
                            <strong>Fecha:</strong>{" "}
                            {booking.date ? dayjs(booking.date).format("DD/MM/YYYY") : "N/A"}
                        </li>
                        <li>
                            <strong>Hora:</strong>{" "}
                            {booking.startTime
                                ? dayjs(booking.startTime, "HH:mm:ss").format("HH:mm")
                                : "N/A"}
                        </li>
                    </ul>
                </div>
            ),
            okText: "Eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            centered: true,
            async onOk() {
                const success = await deleteBooking(booking.id!);
                if (success) {
                    onSuccess?.();
                }
            },
        });
    };

    return (
        <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            size="middle"
            onClick={handleDelete}
        />
    );
};
