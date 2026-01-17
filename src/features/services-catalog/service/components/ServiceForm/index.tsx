"use client";

import { Form, FormInstance, Input, InputNumber, Button, Space, Row, Col, Divider, Switch, Select, Upload, Image, message } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import type { UploadFile, RcFile } from "antd/es/upload/interface";
import { Service } from "../../types/service.types";
import { useBranches } from "@/features/organizations/branch/hooks/useBranches";
import { useEffect, useState } from "react";

interface ServiceFormProps {
    form: FormInstance;
    onFinish: (values: Partial<Service>, file?: File) => void;
    loading?: boolean;
    onCancel?: () => void;
    mode?: "create" | "edit";
    initialImage?: string;
}

export const ServiceForm = ({
    form,
    onFinish,
    loading = false,
    onCancel,
    mode = "create",
    initialImage,
}: ServiceFormProps) => {
    const { branches, fetchBranches } = useBranches();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        fetchBranches({ is_active: true });
    }, [fetchBranches]);

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

    const handleFinish = (values: Partial<Service>) => {
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
            {/* Información Básica */}
            <Divider titlePlacement="left" style={{ marginTop: 0 }}>
                Información Básica
            </Divider>

            <Form.Item label="Imagen del servicio (opcional)">
                <Space align="start" size="middle">
                    {initialImage && mode === "edit" && (
                        <Image
                            src={initialImage}
                            alt="Imagen actual"
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
                                    {mode === "edit" ? "Cambiar imagen" : "Subir imagen"}
                                </div>
                            </div>
                        )}
                    </Upload>
                </Space>
            </Form.Item>

            <Form.Item
                label="Nombre del Servicio"
                name="name"
                rules={[
                    { required: true, message: "El nombre es requerido" },
                    { min: 3, message: "El nombre debe tener al menos 3 caracteres" },
                ]}
            >
                <Input placeholder="Ej: Limpieza dental, Consulta general" size="middle" />
            </Form.Item>

            {mode === "create" && (
                <div>
                    <Form.Item
                        label="Sucursal"
                        name="branch"
                        rules={[
                            { required: true, message: "La sucursal es requerida" },
                        ]}
                    >
                        <Select
                            placeholder="Selecciona una sucursal"
                            showSearch={{optionFilterProp: "children"}}
                            size="middle"
                        >
                            {branches.map((branch) => (
                                <Select.Option key={branch.id} value={branch.id!}>
                                    {branch.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
            )}

            <Form.Item label="Descripción" name="description">
                <Input.TextArea
                    rows={4}
                    placeholder="Describe en qué consiste el servicio..."
                    showCount
                    maxLength={500}
                    size="middle"
                />
            </Form.Item>

            <Form.Item
                label="Servicio Público"
                name="isPublic"
                valuePropName="checked"
                tooltip="Los servicios públicos son visibles para los pacientes al agendar citas"
            >
                <Switch
                    checkedChildren="Público"
                    unCheckedChildren="Privado"
                />
            </Form.Item>

            {/* Detalles del Servicio */}
            <Divider titlePlacement="left" styles={{ content: { margin: 0 } }}>
                Detalles del Servicio
            </Divider>

            <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Precio"
                        name="price"
                        rules={[
                            /* { required: true, message: "El precio es requerido" }, */
                            {
                                type: "number",
                                min: 0.01,
                                message: "El precio debe ser mayor a 0",
                            },
                        ]}
                    >
                        <InputNumber
                            prefix="S/."
                            style={{ width: "100%" }}
                            min={0}
                            step={0.01}
                            precision={2}
                            placeholder="0.00"
                            size="middle"
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                    <Form.Item
                        label="Duración"
                        name="durationMinutes"
                        rules={[
                            /* { required: true, message: "La duración es requerida" }, */
                            {
                                type: "number",
                                min: 1,
                                message: "La duración debe ser mayor a 0",
                            },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={1}
                            step={5}
                            placeholder="60"
                            size="middle"
                            suffix="minutos"
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* Botones de Acción */}
            <Form.Item style={{ marginBottom: 0, marginTop: 32 }}>
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                    <Button onClick={onCancel} size="middle">
                        Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading} size="middle">
                        {mode === "create" ? "Guardar Servicio" : "Actualizar Servicio"}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};
