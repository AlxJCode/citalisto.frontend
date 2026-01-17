"use client";

import { useState } from "react";
import { Modal, Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ServiceForm } from "../ServiceForm";
import { Service } from "../../types/service.types";
import { useServices } from "../../hooks/useServices";
import { mapServiceToApi } from "../../services/service.api";
import { setBackendErrors } from "@/lib/utils/form";

interface AddServiceModalProps {
    onSuccess?: () => void;
}

export const AddServiceModal = ({ onSuccess }: AddServiceModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        form.resetFields();
        setIsOpen(false);
    };
    const { createService } = useServices();

    const handleFinish = async (values: Partial<Service>, file?: File) => {
        setLoading(true);

        const formData = new FormData();

        if (values.name) formData.append("name", values.name);
        if (values.description) formData.append("description", values.description);
        if (values.price) formData.append("price", values.price);
        if (values.durationMinutes) formData.append("duration_minutes", values.durationMinutes.toString());
        if (values.branch) formData.append("branch", values.branch.toString());
        if (values.isPublic !== undefined) formData.append("is_public", values.isPublic ? "true" : "false");
        if (file) formData.append("image", file);

        const result = await createService(formData);

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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpen}>
                Nuevo Servicio
            </Button>

            <Modal
                title="Agregar Servicio"
                open={isOpen}
                onCancel={handleClose}
                footer={null}
                width="64rem"
                destroyOnHidden
                centered
            >
                <ServiceForm
                    form={form}
                    onFinish={handleFinish}
                    loading={loading}
                    onCancel={handleClose}
                    mode="create"
                />
            </Modal>
        </>
    );
};
