"use client";

import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface ConfirmationModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

export const ConfirmationModal = ({
    open,
    onConfirm,
    onCancel,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    loading = false,
}: ConfirmationModalProps) => {
    return (
        <Modal
            open={open}
            onOk={onConfirm}
            onCancel={onCancel}
            okText={confirmText}
            cancelText={cancelText}
            confirmLoading={loading}
            centered
        >
            <div className="flex gap-3 items-start">
                <ExclamationCircleOutlined className="text-xl text-yellow-500 mt-1" />
                <div>
                    <h3 className="text-base font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </Modal>
    );
};
