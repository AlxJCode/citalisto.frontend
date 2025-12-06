"use client";

import { useState, useEffect } from "react";
import { Button, ButtonProps, Modal, Tooltip, Form } from "antd";
import { BranchForm } from "../BranchForm";
import { Branch } from "../../types/branch.types";
import { useBranches } from "../../hooks/useBranches";
import { mapBranchToApi } from "../../services/branch.api";
import { EditOutlined } from "@ant-design/icons";
import { setBackendErrors } from "@/lib/utils/form";

interface EditBranchModalProps {
    branch: Branch | null;
    onSuccess?: () => void;
    size?: ButtonProps["size"];
}

export const EditBranchModal = ({
    branch,
    onSuccess,
    size = "middle",
}: EditBranchModalProps) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const { updateBranch } = useBranches();

    useEffect(() => {
        if (branch && open) {
            form.setFieldsValue(branch);
        }
    }, [branch, open, form]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        form.resetFields();
        setOpen(false);
    };

    const handleFinish = async (values: Partial<Branch>) => {
        if (!branch?.id) return;

        setLoading(true);

        const formData = mapBranchToApi(values);
        const result = await updateBranch(branch.id, formData);

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
            <Tooltip title="Editar Sucursal">
                <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={handleOpen}
                    size={size}
                ></Button>
            </Tooltip>
            <Modal
                title="Editar Sucursal"
                open={open}
                onCancel={() => handleClose()}
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
                    mode="edit"
                />
            </Modal>
        </>
    );
};
