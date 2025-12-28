"use client";

import { useState } from "react";
import {
    Calendar,
    Card,
    Typography,
    Button,
    Space,
    Modal,
    Form,
    TimePicker,
    Select,
    Alert,
    Divider,
    Switch,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const { Title, Text } = Typography;

/* ============================================================================
 * 1️⃣ MOCK DATA – DISPONIBILIDAD SEMANAL Y EXCEPCIONES (solo frontend)
 * ==========================================================================*/

// 0=Lunes ... 6=Domingo
const WEEKLY_TEMPLATE: any = {
    0: { enabled: true, start: "09:00", end: "13:00", breakStart: "11:00", breakEnd: "11:30" },
    1: { enabled: false },
    2: { enabled: true, start: "10:00", end: "16:00" },
    3: { enabled: false },
    4: { enabled: true, start: "14:00", end: "20:00" },
    5: { enabled: false },
    6: { enabled: false },
};

// Excepciones
const INITIAL_EXCEPTIONS = [
    {
        date: "2025-12-02",
        type: "unavailable",
    },
    {
        date: "2025-12-05",
        type: "custom",
        start: "15:00",
        end: "19:00",
    },
];

/* ============================================================================
 * 2️⃣ COMPONENTE PRINCIPAL MVP
 * ==========================================================================*/

export const AvailabilityManagerMVP = () => {
    const [weekly, setWeekly] = useState(WEEKLY_TEMPLATE);
    const [exceptions, setExceptions] = useState(INITIAL_EXCEPTIONS);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editingException, setEditingException] = useState(null as any);
    const [form] = Form.useForm();

    const openNewExceptionModal = (dateStr: string) => {
        setEditingException(null);
        form.resetFields();
        form.setFieldsValue({ date: dateStr, type: "unavailable" });
        setModalOpen(true);
    };

    const openEditExceptionModal = (exc: any) => {
        setEditingException(exc);
        form.setFieldsValue(exc);
        setModalOpen(true);
    };

    const saveException = () => {
        form.validateFields().then((values) => {
            const exists = exceptions.find((e) => e.date === values.date);

            let updated;
            if (exists) {
                updated = exceptions.map((e) => (e.date === values.date ? values : e));
            } else {
                updated = [...exceptions, values];
            }

            setExceptions(updated);
            setModalOpen(false);
        });
    };

    const removeException = (dateStr: string) => {
        setExceptions(exceptions.filter((e) => e.date !== dateStr));
    };

    const toggleWeeklyDay = (day: number, enabled: boolean) => {
        const updated = { ...weekly };
        updated[day] = enabled ? { ...WEEKLY_TEMPLATE[day], enabled: true } : { enabled: false };
        setWeekly(updated);
    };

    return (
        <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* ------------------------------------------------------ */}
            {/* 1) Calendario */}
            {/* ------------------------------------------------------ */}
            <Card>
                <Title level={4}>Calendario</Title>
                <Calendar
                    fullscreen={false}
                    value={selectedDate}
                    onSelect={(d) => {
                        setSelectedDate(d);
                    }}
                />

                <Button
                    type="primary"
                    className="mt-4"
                    onClick={() => openNewExceptionModal(selectedDate.format("YYYY-MM-DD"))}
                >
                    Agregar excepción al {selectedDate.format("DD/MM/YYYY")}
                </Button>
            </Card>

            {/* ------------------------------------------------------ */}
            {/* 2) Gestión de excepciones */}
            {/* ------------------------------------------------------ */}
            <Card>
                <Title level={4}>Excepciones configuradas</Title>

                {!exceptions.length && (
                    <Alert type="info" title="No hay excepciones registradas" />
                )}

                <Space orientation="vertical" style={{ width: "100%" }}>
                    {exceptions.map((exc, idx) => (
                        <Card key={idx}>
                            <Space orientation="vertical">
                                <Text strong>{dayjs(exc.date).format("DD/MM/YYYY")}</Text>
                                <Text>
                                    {exc.type === "unavailable" && "Día bloqueado"}
                                    {exc.type === "custom" && `Horario: ${exc.start}–${exc.end}`}
                                </Text>

                                <Space>
                                    <Button
                                        size="small"
                                        onClick={() => openEditExceptionModal(exc)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        danger
                                        size="small"
                                        onClick={() => removeException(exc.date)}
                                    >
                                        Eliminar
                                    </Button>
                                </Space>
                            </Space>
                        </Card>
                    ))}
                </Space>
            </Card>

            {/* ------------------------------------------------------ */}
            {/* 3) Disponibilidad semanal (Horario base) */}
            {/* ------------------------------------------------------ */}
            <Card className="md:col-span-2">
                <Title level={4}>Disponibilidad semanal</Title>

                {Object.entries(weekly).map(([day, conf]: any) => (
                    <div key={day} className="mb-4 p-4 border rounded-md">
                        <Space align="center">
                            <Text strong>
                                {
                                    [
                                        "Lunes",
                                        "Martes",
                                        "Miércoles",
                                        "Jueves",
                                        "Viernes",
                                        "Sábado",
                                        "Domingo",
                                    ][Number(day)]
                                }
                            </Text>
                            <Switch
                                checked={!!conf.enabled}
                                onChange={(checked) => toggleWeeklyDay(Number(day), checked)}
                            />
                        </Space>

                        {conf.enabled && (
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Text>Hora inicio</Text>
                                    <TimePicker
                                        defaultValue={dayjs(conf.start, "HH:mm")}
                                        format="HH:mm"
                                        className="w-full"
                                        needConfirm={false}
                                    />
                                </div>

                                <div>
                                    <Text>Hora fin</Text>
                                    <TimePicker
                                        defaultValue={dayjs(conf.end, "HH:mm")}
                                        format="HH:mm"
                                        className="w-full"
                                        needConfirm={false}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </Card>

            {/* ------------------------------------------------------ */}
            {/* 4) Modal para crear/editar excepción */}
            {/* ------------------------------------------------------ */}
            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                title={editingException ? "Editar excepción" : "Agregar excepción"}
                onOk={saveException}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="date" label="Fecha">
                        <Text strong>{form.getFieldValue("date")}</Text>
                    </Form.Item>

                    <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { label: "Bloquear día completo", value: "unavailable" },
                                { label: "Horario personalizado", value: "custom" },
                            ]}
                        />
                    </Form.Item>

                    {form.getFieldValue("type") === "custom" && (
                        <>
                            <Form.Item
                                name="start"
                                label="Hora inicio"
                                rules={[{ required: true }]}
                            >
                                <TimePicker format="HH:mm" className="w-full" needConfirm={false}/>
                            </Form.Item>

                            <Form.Item name="end" label="Hora fin" rules={[{ required: true }]}>
                                <TimePicker format="HH:mm" className="w-full" needConfirm={false}/>
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
};
