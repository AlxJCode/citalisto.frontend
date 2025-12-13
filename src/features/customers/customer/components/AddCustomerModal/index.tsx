"use client";

import { useState } from "react";
import { Modal, Button, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CustomerForm } from "../CustomerForm";
import { Customer } from "../../types/customer.types";
import { useCustomers } from "../../hooks/useCustomers";
import { mapCustomerToApi } from "../../services/customer.api";
import { setBackendErrors } from "@/lib/utils/form";

interface AddCustomerModalProps {
    onSuccess?: (newCustomer?: Customer) => void;
}

export const AddCustomerModal = ({ onSuccess }: AddCustomerModalProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        form.resetFields();
        setOpen(false);
    };
    const { createCustomer } = useCustomers();

    const handleFinish = async (values: Partial<Customer>) => {
        setLoading(true);

        const formData = mapCustomerToApi(values);
        const result = await createCustomer(formData);

        setLoading(false);

        if (!result.success) {
            if (result.errorFields) {
                setBackendErrors(form, result.errorFields);
            }
            return;
        }

        handleClose();
        onSuccess?.(result.newObject);
    };

    return (
        <>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpen}>
                Nuevo Cliente
            </Button>

            <Modal
                title="Agregar Cliente"
                open={open}
                onCancel={handleClose}
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
                    mode="create"
                />
            </Modal>
        </>
    );
};
