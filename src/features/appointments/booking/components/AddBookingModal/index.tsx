"use client";

import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";

export const AddBookingModal = () => {

    return (
        <Link href="/bookings/calendar">
            <Button type="primary" icon={<PlusOutlined />} >
                Nueva Cita
            </Button>
        </Link>
    );
};
