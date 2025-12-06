"use client";

import { Switch, TimePicker, Space, Typography, Row, Col, Button } from "antd";
import { ClockCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import { DaySchedule, DayOfWeek } from "@/features/schedules/weekly-availability/types/schedule-editor.types";

const { Text } = Typography;

interface DayScheduleRowProps {
    day: DayOfWeek;
    schedule: DaySchedule;
    saving: boolean;
    onToggleDay: (enabled: boolean) => void;
    onTimeChange: (field: "startTime" | "endTime" | "breakStartTime" | "breakEndTime", time: Dayjs | null) => void;
    onToggleBreak: (hasBreak: boolean) => void;
    onSave: () => void;
}

export const DayScheduleRow = ({
    day,
    schedule,
    saving,
    onToggleDay,
    onTimeChange,
    onToggleBreak,
    onSave,
}: DayScheduleRowProps) => {
    const canSave = schedule.enabled && schedule.startTime && schedule.endTime &&
                    (!schedule.hasBreak || (schedule.breakStartTime && schedule.breakEndTime));

    return (
        <Row gutter={[8, 8]} align="top">
            <Col xs={24} sm={24} md={4}>
                <Space>
                    <Switch
                        checked={schedule.enabled}
                        onChange={onToggleDay}
                        loading={saving}
                    />
                    <Text strong>{day.name}</Text>
                </Space>
            </Col>

            {schedule.enabled && (
                <>
                    <Col xs={24} sm={12} md={7}>
                        <Space wrap>
                            <ClockCircleOutlined />
                            <TimePicker
                                value={schedule.startTime}
                                onChange={(time) => onTimeChange("startTime", time)}
                                format="HH:mm"
                                placeholder="Inicio"
                                style={{ width: 90 }}
                                disabled={saving}
                            />
                            <Text type="secondary">a</Text>
                            <TimePicker
                                value={schedule.endTime}
                                onChange={(time) => onTimeChange("endTime", time)}
                                format="HH:mm"
                                placeholder="Fin"
                                style={{ width: 90 }}
                                disabled={saving}
                            />
                        </Space>
                    </Col>

                    <Col xs={24} sm={12} md={10}>
                        <Space wrap>
                            <Switch
                                checked={schedule.hasBreak}
                                onChange={onToggleBreak}
                                size="small"
                                disabled={saving}
                            />
                            <Text type="secondary">Descanso</Text>
                            {schedule.hasBreak && (
                                <>
                                    <TimePicker
                                        value={schedule.breakStartTime}
                                        onChange={(time) => onTimeChange("breakStartTime", time)}
                                        format="HH:mm"
                                        placeholder="Inicio"
                                        style={{ width: 90 }}
                                        disabled={saving}
                                    />
                                    <Text type="secondary">a</Text>
                                    <TimePicker
                                        value={schedule.breakEndTime}
                                        onChange={(time) => onTimeChange("breakEndTime", time)}
                                        format="HH:mm"
                                        placeholder="Fin"
                                        style={{ width: 90 }}
                                        disabled={saving}
                                    />
                                </>
                            )}
                        </Space>
                    </Col>

                    <Col xs={24} sm={24} md={3}>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={onSave}
                            loading={saving}
                            disabled={!canSave}
                            block
                        >
                            Guardar
                        </Button>
                    </Col>
                </>
            )}
        </Row>
    );
};
