"use client";

import { Button, Modal } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useCustomers } from "../../hooks/useCustomers";
import { Customer } from "../../types/customer.types";

interface DeleteCustomerModalProps {
    customer: Customer;
    onSuccess?: () => void;
}

export const DeleteCustomerModal = ({ customer, onSuccess }: DeleteCustomerModalProps) => {
    const { deleteCustomer } = useCustomers();

    const handleDelete = () => {
        Modal.confirm({
            title: "¿Eliminar cliente?",
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>
                        ¿Estás seguro de que deseas eliminar el cliente{" "}
                        <strong>{customer.name} {customer.lastName}</strong>?
                    </p>
                </div>
            ),
            okText: "Eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            centered: true,
            async onOk() {
                const success = await deleteCustomer(customer.id);
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
