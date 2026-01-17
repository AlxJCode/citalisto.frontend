"use client";

import { useState, useEffect } from "react";
import { Button, ButtonProps, Modal, Tooltip, Form } from "antd";
import { ProfessionalForm } from "../ProfessionalForm";
import { Professional } from "../../types/professional.types";
import { useProfessionals } from "../../hooks/useProfessionals";
import { mapProfessionalToApi } from "../../services/professional.api";
import { EditOutlined } from "@ant-design/icons";
import { setBackendErrors } from "@/lib/utils/form";

interface EditProfessionalModalProps {
    professional: Professional | null;
    onSuccess?: () => void;
    size?: ButtonProps["size"];
}

export const EditProfessionalModal = ({
    professional,
    onSuccess,
    size = "middle",
}: EditProfessionalModalProps) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const { updateProfessional } = useProfessionals();

    useEffect(() => {
        if (professional && open) {
            form.setFieldsValue(professional);
        }
    }, [professional, open, form]);

    const initialPhoto = professional?.profilePhoto || undefined;

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        form.resetFields();
        setOpen(false);
    };

    const handleFinish = async (values: Partial<Professional>, file?: File) => {
        if (!professional?.id) return;

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

        const result = await updateProfessional(professional.id, formData);

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
            <Tooltip title="Editar Profesional">
                <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={handleOpen}
                    size={size}
                ></Button>
            </Tooltip>
            <Modal
                title="Editar Profesional"
                open={open}
                onCancel={() => handleClose()}
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
                    mode="edit"
                    initialPhoto={initialPhoto}
                />
            </Modal>
        </>
    );
};
