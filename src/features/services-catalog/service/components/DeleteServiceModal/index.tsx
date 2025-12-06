"use client";

import { Button, Modal } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useServices } from "../../hooks/useServices";
import { Service } from "../../types/service.types";

interface DeleteServiceModalProps {
    service: Service;
    onSuccess?: () => void;
}

export const DeleteServiceModal = ({ service, onSuccess }: DeleteServiceModalProps) => {
    const { deleteService } = useServices();

    const handleDelete = () => {
        Modal.confirm({
            title: "¿Eliminar servicio?",
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>
                        ¿Estás seguro de que deseas eliminar el servicio{" "}
                        <strong>{service.name}</strong>?
                    </p>
                </div>
            ),
            okText: "Eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            centered: true,
            async onOk() {
                const success = await deleteService(service.id);
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
