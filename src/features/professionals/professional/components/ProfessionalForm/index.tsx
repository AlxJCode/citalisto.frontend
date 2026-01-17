"use client";

import { useEffect, useState } from "react";
import { Form, FormInstance, Input, Button, Space, Divider, Row, Col, Select, Upload, Image, message } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { Professional } from "../../types/professional.types";
import { useServices } from "@/features/services-catalog/service/hooks/useServices";
import { useBranches } from "@/features/organizations/branch/hooks/useBranches";

interface ProfessionalFormProps {
    form: FormInstance;
    onFinish: (values: Partial<Professional>, file?: File) => void;
    loading?: boolean;
    onCancel?: () => void;
    mode?: "create" | "edit";
    initialPhoto?: string;
}

export const ProfessionalForm = ({
    form,
    onFinish,
    loading = false,
    onCancel,
    mode = "create",
    initialPhoto,
}: ProfessionalFormProps) => {
    const { services, loading: loadingServices, fetchServices } = useServices();
    const { branches, loading: loadingBranches, fetchBranches } = useBranches();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        fetchServices({ is_active: true, per_page: 100 });
        fetchBranches({ is_active: true, per_page: 100 });
    }, []);


    const beforeUpload = (file: RcFile) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("Solo puedes subir archivos de imagen");
            return Upload.LIST_IGNORE;
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("La imagen debe pesar menos de 2MB");
            return Upload.LIST_IGNORE;
        }

        return false;
    };

    const handleFinish = (values: Partial<Professional>) => {
        const file = fileList[0]?.originFileObj;
        onFinish(values, file);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            disabled={loading}
            style={{ marginTop: 24 }}
        >
            <Divider titlePlacement="left" style={{ marginTop: 0 }}>
                Datos Personales
            </Divider>

            <Row gutter={16}>
                <Col xs={24}>
                    <Form.Item label="Foto de perfil (opcional)">
                        <Space align="start" size="middle">
                            {initialPhoto && mode === "edit" && (
                                <Image
                                    src={initialPhoto}
                                    alt="Foto actual"
                                    width={100}
                                    height={100}
                                    style={{ objectFit: "cover", borderRadius: 8 }}
                                    preview
                                />
                            )}
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={({ fileList }) => setFileList(fileList)}
                                beforeUpload={beforeUpload}
                                maxCount={1}
                                accept="image/*"
                            >
                                {fileList.length === 0 && (
                                    <div>
                                        <PictureOutlined />
                                        <div style={{ marginTop: 8 }}>
                                            {mode === "edit" ? "Cambiar foto" : "Subir imagen"}
                                        </div>
                                    </div>
                                )}
                            </Upload>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Nombres"
                        name="name"
                        rules={[
                            { required: true, message: "El nombre es requerido" },
                            { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
                        ]}
                    >
                        <Input placeholder="Ej: Juan" size="middle" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} lg={8}>
                    <Form.Item
                        label="Apellidos"
                        name="lastName"
                        rules={[
                            { required: true, message: "El apellido es requerido" },
                            { min: 3, message: "El apellido debe tener al menos 3 caracteres" },
                        ]}
                    >
                        <Input placeholder="Ej: Pérez" size="middle" />
                    </Form.Item>
                </Col>
            </Row>

            <Divider titlePlacement="left">Información de Contacto</Divider>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "El email es requerido" },
                            {
                                type: "email",
                                message: "Ingresa un email válido",
                            },
                        ]}
                    >
                        <Input placeholder="Ej: profesional@example.com" size="middle" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Teléfono"
                        name="phone"
                        rules={[
                            { required: true, message: "El teléfono es requerido" },
                            {
                                pattern: /^[0-9]{9}$/,
                                message: "El teléfono debe tener 9 dígitos",
                            },
                        ]}
                    >
                        <Input placeholder="Ej: 987654321" size="middle" maxLength={9} />
                    </Form.Item>
                </Col>
            </Row>

            <Divider titlePlacement="left">Información Profesional</Divider>

            <Row gutter={16}>
                <Col xs={24}>
                    <Form.Item
                        label="Sucursal"
                        name="branch"
                        rules={[
                            { required: true, message: "La sucursal es requerida" },
                        ]}
                    >
                        <Select
                            placeholder="Selecciona una sucursal"
                            size="middle"
                            options={branches.map((branch) => ({
                                label: branch.name,
                                value: branch.id,
                            }))}
                            loading={loadingBranches}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item
                        label="Servicios"
                        name="services"
                        rules={[
                            { required: true, message: "Selecciona al menos un servicio" },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Selecciona servicios"
                            size="middle"
                            options={services.map((service) => ({
                                label: service.name,
                                value: service.id,
                            }))}
                            loading={loadingServices}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24}>
                    <Form.Item label="Descripción" name="description">
                        <Input.TextArea
                            rows={4}
                            placeholder="Información adicional sobre el profesional..."
                            showCount
                            maxLength={500}
                            size="middle"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                    <Button onClick={onCancel} size="middle">
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} size="middle">
                        {mode === "create" ? "Guardar Profesional" : "Actualizar Profesional"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
