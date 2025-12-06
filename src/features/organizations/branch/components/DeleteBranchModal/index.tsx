"use client";

import { Button, Modal } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useBranches } from "../../hooks/useBranches";
import { Branch } from "../../types/branch.types";

interface DeleteBranchModalProps {
    branch: Branch;
    onSuccess?: () => void;
}

export const DeleteBranchModal = ({ branch, onSuccess }: DeleteBranchModalProps) => {
    const { deleteBranch } = useBranches();

    const handleDelete = () => {
        Modal.confirm({
            title: "¿Eliminar sucursal?",
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>
                        ¿Estás seguro de que deseas eliminar la sucursal{" "}
                        <strong>{branch.name}</strong>?
                    </p>
                </div>
            ),
            okText: "Eliminar",
            okType: "danger",
            cancelText: "Cancelar",
            centered: true,
            async onOk() {
                const success = await deleteBranch(branch.id);
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
