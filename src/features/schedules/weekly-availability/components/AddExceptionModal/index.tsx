"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Form, Radio, DatePicker, TimePicker, Input, Space, Switch, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useAvailabilityExceptions } from "@/features/schedules/availability-exception/hooks/useAvailabilityExceptions";
import { setBackendErrors } from "@/lib/utils/form";

const { TextArea } = Input;

interface AddExceptionModalProps {
    professionalId: number;
    selectedDate: Dayjs | null;
    onSuccess?: () => void;
}

export const AddExceptionModal = ({ professionalId, selectedDate, onSuccess }: AddExceptionModalProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [exceptionType, setExceptionType] = useState<"unavailable" | "available">("unavailable");
    const [hasBreak, setHasBreak] = useState(false);
    const [form] = Form.useForm();
    const { createAvailabilityException } = useAvailabilityExceptions();

    useEffect(() => {
        if (open && selectedDate) {
            form.setFieldsValue({
                date: selectedDate,
                status: "unavailable",
                startTime: dayjs("09:00", "HH:mm"),
                endTime: dayjs("18:00", "HH:mm"),
            });
        }
    }, [open, selectedDate, form]);

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        form.resetFields();
        setExceptionType("unavailable");
        setHasBreak(false);
        setOpen(false);
    };

    const handleFinish = async (values: any) => {
        setLoading(true);

        const formData = {
            professional: professionalId,
            date: values.date.format("YYYY-MM-DD"),
            status: values.status,
            start_time: values.status === "available" && values.startTime ? values.startTime.format("HH:mm:ss") : null,
            end_time: values.status === "available" && values.endTime ? values.endTime.format("HH:mm:ss") : null,
            break_start_time: values.status === "available" && hasBreak && values.breakStartTime ? values.breakStartTime.format("HH:mm:ss") : null,
            break_end_time: values.status === "available" && hasBreak && values.breakEndTime ? values.breakEndTime.format("HH:mm:ss") : null,
            notes: values.notes || null,
        };

        const result = await createAvailabilityException(formData);
        setLoading(false);

        if (!result.success) {
            if (result.errorFields) {
                setBackendErrors(form, result.errorFields);
            }
            return;
        }
        message.success("Excepción creada correctamente");

        handleClose();
        onSuccess?.();
    };

    return (
        <>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleOpen} size="middle">
                Agregar Excepción
            </Button>

            <Modal
                title="Agregar Excepción de Disponibilidad"
                open={open}
                onCancel={handleClose}
                footer={null}
                width={600}
                destroyOnHidden
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                    initialValues={{
                        status: "unavailable",
                        date: selectedDate,
                    }}
                >
                    <Form.Item
                        label="Fecha"
                        name="date"
                        rules={[{ required: true, message: "Selecciona una fecha" }]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format="dddd DD [de] MMMM [del] YYYY"
                            placeholder="Seleccionar fecha"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tipo de Excepción"
                        name="status"
                        rules={[{ required: true }]}
                    >
                        <Radio.Group
                            onChange={(e) => setExceptionType(e.target.value)}
                            buttonStyle="solid"
                        >
                            <Radio.Button value="unavailable">Bloquear Día</Radio.Button>
                            <Radio.Button value="available">Horario Personalizado</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    {exceptionType === "available" && (
                        <>
                            <Form.Item label="Horario">
                                <Space.Compact style={{ width: "100%" }}>
                                    <Form.Item
                                        name="startTime"
                                        noStyle
                                        rules={[{ required: true, message: "Requerido" }]}
                                    >
                                        <TimePicker
                                            format="HH:mm"
                                            placeholder="Inicio"
                                            style={{ width: "50%" }}
                                            needConfirm={false}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="endTime"
                                        noStyle
                                        rules={[{ required: true, message: "Requerido" }]}
                                    >
                                        <TimePicker
                                            format="HH:mm"
                                            placeholder="Fin"
                                            style={{ width: "50%" }}
                                            needConfirm={false}
                                        />
                                    </Form.Item>
                                </Space.Compact>
                            </Form.Item>

                            <Form.Item label="Descanso">
                                <Space orientation="vertical" style={{ width: "100%" }}>
                                    <Switch
                                        checked={hasBreak}
                                        onChange={setHasBreak}
                                        checkedChildren="Con descanso"
                                        unCheckedChildren="Sin descanso"
                                    />
                                    {hasBreak && (
                                        <Space.Compact style={{ width: "100%" }}>
                                            <Form.Item
                                                name="breakStartTime"
                                                noStyle
                                                rules={[{ required: hasBreak, message: "Requerido" }]}
                                            >
                                                <TimePicker
                                                    format="HH:mm"
                                                    placeholder="Inicio descanso"
                                                    style={{ width: "50%" }}
                                                    needConfirm={false}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name="breakEndTime"
                                                noStyle
                                                rules={[{ required: hasBreak, message: "Requerido" }]}
                                            >
                                                <TimePicker
                                                    format="HH:mm"
                                                    placeholder="Fin descanso"
                                                    style={{ width: "50%" }}
                                                    needConfirm={false}
                                                />
                                            </Form.Item>
                                        </Space.Compact>
                                    )}
                                </Space>
                            </Form.Item>
                        </>
                    )}

                    <Form.Item label="Notas (opcional)" name="notes">
                        <TextArea
                            rows={3}
                            placeholder="Ejemplo: Vacaciones, día festivo, evento especial..."
                            maxLength={200}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                        <Space>
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Guardar
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
