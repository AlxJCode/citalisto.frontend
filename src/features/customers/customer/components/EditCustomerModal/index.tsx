"use client";

import { useState, useEffect } from "react";
import { Button, ButtonProps, Modal, Tooltip, Form } from "antd";
import { CustomerForm } from "../CustomerForm";
import { Customer } from "../../types/customer.types";
import { useCustomers } from "../../hooks/useCustomers";
import { mapCustomerToApi } from "../../services/customer.api";
import { EditOutlined } from "@ant-design/icons";
import { setBackendErrors } from "@/lib/utils/form";

interface EditCustomerModalProps {
    customer: Customer | null;
    onSuccess?: () => void;
    size?: ButtonProps["size"];
}

export const EditCustomerModal = ({
    customer,
    onSuccess,
    size = "middle",
}: EditCustomerModalProps) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const { updateCustomer } = useCustomers();

    useEffect(() => {
        if (customer && open) {
            form.setFieldsValue(customer);
        }
    }, [customer, open, form]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        form.resetFields();
        setOpen(false);
    };

    const handleFinish = async (values: Partial<Customer>) => {
        if (!customer?.id) return;

        setLoading(true);

        const formData = mapCustomerToApi(values);
        const result = await updateCustomer(customer.id, formData);

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
            <Tooltip title="Editar Cliente">
                <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={handleOpen}
                    size={size}
                ></Button>
            </Tooltip>
            <Modal
                title="Editar Cliente"
                open={open}
                onCancel={() => handleClose()}
                footer={null}
                width="64rem"
                destroyOnHidden
                centered
            >
                <CustomerForm
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
