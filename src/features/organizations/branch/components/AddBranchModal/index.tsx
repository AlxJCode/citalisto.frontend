"use client";

import { useState } from "react";
import { Modal, Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { BranchForm } from "../BranchForm";
import { Branch } from "../../types/branch.types";
import { useBranches } from "../../hooks/useBranches";
import { mapBranchToApi } from "../../services/branch.api";
import { setBackendErrors } from "@/lib/utils/form";

interface AddBranchModalProps {
    onSuccess?: () => void;
}

export const AddBranchModal = ({ onSuccess }: AddBranchModalProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        form.resetFields();
        setOpen(false);
    };
    const { createBranch } = useBranches();

    const handleFinish = async (values: Partial<Branch>) => {
        setLoading(true);

        const formData = mapBranchToApi(values);
        const result = await createBranch(formData);

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
                Nueva Sucursal
            </Button>

            <Modal
                title="Agregar Sucursal"
                open={open}
                onCancel={handleClose}
                footer={null}
                width="64rem"
                destroyOnHidden
                centered
            >
                <BranchForm
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
