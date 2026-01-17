"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Select, Upload, Avatar, message } from "antd";
import { ShopOutlined, UploadOutlined } from "@ant-design/icons";
import { useBusinesses } from "@/features/organizations/business/hooks/useBusinesses";
import { Business } from "@/features/organizations/business/types/business.types";
import { useCategories } from "@/features/organizations/category/hooks/useCategories";
import { useRouter } from "next/navigation";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { refreshUserDataAction } from "@/features/auth/actions/auth.actions";

interface BusinessFormProps {
    business: Business;
}

export const BusinessForm = ({ business }: BusinessFormProps) => {
    const [form] = Form.useForm();
    const { updateBusiness } = useBusinesses();
    const { categories, fetchCategories } = useCategories();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        fetchCategories({per_page: 50, is_active:true});
    }, [fetchCategories]);

    const handleSubmit = async (values: {
        category: number;
        phone: string;
    }) => {
        setLoading(true);
        const result = await updateBusiness(business.id, {
            category: values.category,
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

    const handleLogoChange = async (info: { fileList: UploadFile[] }) => {
        setFileList(info.fileList.slice(-1));

        if (info.fileList.length > 0 && info.fileList[0].originFileObj) {
            const formData = new FormData();
            formData.append("logo", info.fileList[0].originFileObj);

            setUploading(true);
            const result = await updateBusiness(business.id, formData as any);
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
                    src={business.logo}
                    icon={<ShopOutlined />}
                    shape="square"
                />
                <div>
                    <Upload
                        fileList={fileList}
                        beforeUpload={beforeUpload}
                        onChange={handleLogoChange}
                        accept="image/*"
                        maxCount={1}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} loading={uploading}>
                            Cambiar logo
                        </Button>
                    </Upload>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG o GIF. Máximo 2MB</p>
                </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Nombre del Negocio</p>
                <p className="text-lg font-semibold text-gray-900">{business.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                    Contacta a soporte para cambiar el nombre del negocio
                </p>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    category: business.category,
                    phone: business.phone,
                }}
            >
                <Form.Item
                    label="Categoría"
                    name="category"
                    rules={[{ required: true, message: "Selecciona la categoría" }]}
                >
                    <Select size="large" placeholder="Selecciona una categoría" loading={!categories.length}
                        showSearch={{optionFilterProp: "children"}}
                    >
                        {categories
                            .filter((cat) => cat.isActive)
                            .map((category) => (
                                <Select.Option key={category.id} value={category.id}
                                >
                                    {category.name}
                                </Select.Option>
                            ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Teléfono"
                    name="phone"
                    rules={[
                        { required: true, message: "Ingresa el teléfono" },
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
