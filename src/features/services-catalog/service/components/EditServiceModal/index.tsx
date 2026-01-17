"use client";

import { useState, useEffect } from "react";
import { Button, ButtonProps, Modal, Tooltip, Form } from "antd";
import { ServiceForm } from "../ServiceForm";
import { Service } from "../../types/service.types";
import { useServices } from "../../hooks/useServices";
import { mapServiceToApi } from "../../services/service.api";
import { EditOutlined } from "@ant-design/icons";
import { setBackendErrors } from "@/lib/utils/form";

interface EditServiceModalProps {
    service: Service | null;
    onSuccess?: () => void;
    size?: ButtonProps["size"];
}

export const EditServiceModal = ({
    service,
    onSuccess,
    size = "middle",
}: EditServiceModalProps) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const { updateService } = useServices();

    useEffect(() => {
        if (service && open) {
            form.setFieldsValue({
                ...service,
                price:
                    typeof service.price === "string"
                        ? parseFloat(service.price)
                        : service.price,
            });
        }
    }, [service, open, form]);

    const initialImage = service?.image || undefined;

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        form.resetFields();
        setOpen(false);
    };

    const handleFinish = async (values: Partial<Service>, file?: File) => {
        if (!service?.id) return;

        setLoading(true);

        const formData = new FormData();

        if (values.name) formData.append("name", values.name);
        if (values.description) formData.append("description", values.description);
        if (values.price) formData.append("price", values.price);
        if (values.durationMinutes) formData.append("duration_minutes", values.durationMinutes.toString());
        if (values.isPublic !== undefined) formData.append("is_public", values.isPublic ? "true" : "false");
        if (file) formData.append("image", file);
        // Listar los datos del formData
        console.log(formData);
        console.log(values, file);
        const result = await updateService(service.id, formData);

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
            <Tooltip title="Editar Servicio">
                <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={handleOpen}
                    size={size}
                ></Button>
            </Tooltip>
            <Modal
                title="Editar Servicio"
                open={open}
                onCancel={() => handleClose()}
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
                    mode="edit"
                    initialImage={initialImage}
                />
            </Modal>
        </>
    );
};
