"use client";

import { Button, Modal } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useProfessionals } from "../../hooks/useProfessionals";
import { Professional } from "../../types/professional.types";

interface DeleteProfessionalModalProps {
    professional: Professional;
    onSuccess?: () => void;
}

export const DeleteProfessionalModal = ({ professional, onSuccess }: DeleteProfessionalModalProps) => {
    const { deleteProfessional } = useProfessionals();

    const handleDelete = () => {
        Modal.confirm({
            title: "¿Eliminar profesional?",
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>
                        ¿Estás seguro de que deseas eliminar el profesional{" "}
                        <strong>{professional.name} {professional.lastName}</strong>?
                    </p>
                </div>
            ),
            okText: "Eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            centered: true,
            async onOk() {
                const success = await deleteProfessional(professional.id);
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
