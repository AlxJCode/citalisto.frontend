"use client";

import { useState } from "react";
import { Modal, Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ProfessionalForm } from "../ProfessionalForm";
import { Professional } from "../../types/professional.types";
import { useProfessionals } from "../../hooks/useProfessionals";
import { mapProfessionalToApi } from "../../services/professional.api";
import { setBackendErrors } from "@/lib/utils/form";

interface AddProfessionalModalProps {
    onSuccess?: () => void;
}

export const AddProfessionalModal = ({ onSuccess }: AddProfessionalModalProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        form.resetFields();
        setOpen(false);
    };
    const { createProfessional } = useProfessionals();

    const handleFinish = async (values: Partial<Professional>, file?: File) => {
        setLoading(true);

        const formData = new FormData();

        if (values.name) formData.append("name", values.name);
        if (values.lastName) formData.append("last_name", values.lastName);
        if (values.email) formData.append("email", values.email);
        if (values.phone) formData.append("phone", values.phone);
        if (values.branch) formData.append("branch", values.branch.toString());
        if (values.description) formData.append("description", values.description);
        if (values.services) {
            values.services.forEach((serviceId) => {
                formData.append("services", serviceId.toString());
            });
        }
        if (file) formData.append("profile_photo", file);

        const result = await createProfessional(formData);

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
                Nuevo Profesional
            </Button>

            <Modal
                title="Agregar Profesional"
                open={open}
                onCancel={handleClose}
                footer={null}
                width="64rem"
                destroyOnHidden
                centered
            >
                <ProfessionalForm
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
