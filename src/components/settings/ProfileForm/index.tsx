"use client";

import { useState } from "react";
import { Form, Input, Button, Avatar, Upload, message } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { useUsers } from "@/features/users/user/hooks/useUsers";
import { SessionUser } from "@/lib/auth/types";
import { useRouter } from "next/navigation";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { refreshUserDataAction } from "@/features/auth/actions/auth.actions";

interface ProfileFormProps {
    user: SessionUser;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
    const [form] = Form.useForm();
    const { updateUser } = useUsers();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleSubmit = async (values: {
        firstName: string;
        lastName: string;
        motherLastName?: string;
        email: string;
        dni?: string;
        phone?: string;
    }) => {
        setLoading(true);
        const result = await updateUser(user.id, {
            first_name: values.firstName,
            last_name: values.lastName,
            mother_last_name: values.motherLastName,
            email: values.email,
            dni: values.dni,
            phone: values.phone,
        });
        if (result.status) setLoading(false);

        if (result.success) {
            await refreshUserDataAction();
            router.refresh();
        } else if (result.errorFields) {
            form.setFields(
                Object.entries(result.errorFields).map(([name, errors]) => ({
                    name,
                    errors,
                }))
            );
        }
    };

    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Solo puedes subir archivos de imagen (JPG, PNG, GIF)");
            return Upload.LIST_IGNORE;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("La imagen debe pesar menos de 2MB");
            return Upload.LIST_IGNORE;
        }

        return false;
    };

    const handlePhotoChange = async (info: { fileList: UploadFile[] }) => {
        setFileList(info.fileList.slice(-1));

        if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append("profile_picture", info.fileList[0].originFileObj);

            setUploading(true);
            const result = await updateUser(user.id, formData as any);
            setUploading(false);

            if (result.success) {
                setFileList([]);
                await refreshUserDataAction();
                router.refresh();
            }
        }
    };

    return (
        <div>
            <div className="flex items-center gap-6 mb-8">
                <Avatar
                    size={80}
                    src={user.profilePicture}
                    icon={<UserOutlined />}
                />
                <div>
                    <Upload
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handlePhotoChange}
                        accept="image/*"
                        maxCount={1}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} loading={uploading}>
                            Cambiar foto
                        </Button>
                    </Upload>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG o GIF. Máximo 2MB</p>
                </div>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    motherLastName: user.motherLastName,
                    email: user.email,
                    dni: user.dni,
                    phone: user.phone,
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label="Nombre"
                        name="firstName"
                        rules={[{ required: true, message: "Ingresa tu nombre" }]}
                    >
                        <Input size="large" placeholder="Nombre" />
                    </Form.Item>

                    <Form.Item
                        label="Apellido"
                        name="lastName"
                        rules={[{ required: true, message: "Ingresa tu apellido" }]}
                    >
                        <Input size="large" placeholder="Apellido" />
                    </Form.Item>

                    <Form.Item label="Apellido materno" name="motherLastName">
                        <Input size="large" placeholder="Apellido materno" />
                    </Form.Item>

                    <Form.Item
                        label="DNI"
                        name="dni"
                        rules={[
                            { pattern: /^\d{8}$/, message: "El DNI debe tener 8 dígitos" },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="12345678"
                            maxLength={8}
                            onKeyPress={(e) => {
                                if (!/\d/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Ingresa tu email" },
                        { type: "email", message: "Email inválido" },
                    ]}
                >
                    <Input size="large" placeholder="Email" />
                </Form.Item>

                <Form.Item
                    label="Teléfono"
                    name="phone"
                    rules={[
                        { pattern: /^\d{9}$/, message: "El teléfono debe tener 9 dígitos" },
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="987654321"
                        maxLength={9}
                        onKeyPress={(e) => {
                            if (!/\d/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" loading={loading}>
                        Guardar cambios
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
