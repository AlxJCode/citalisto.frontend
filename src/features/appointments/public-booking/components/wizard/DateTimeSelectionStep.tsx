"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Spin, Alert } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface DateTimeSelectionStepProps {
    selectedDate: Dayjs | null;
    selectedSlot: string | null;
    availableSlots: string[];
    loading: boolean;
    onSelectDate: (date: Dayjs) => void;
    onSelectSlot: (slot: string) => void;
}

export const DateTimeSelectionStep: React.FC<DateTimeSelectionStepProps> = ({
    selectedDate,
    selectedSlot,
    availableSlots,
    loading,
    onSelectDate,
    onSelectSlot,
}) => {
    const disabledDate = (current: Dayjs) => {
        const today = dayjs().startOf("day");
        const maxDate = dayjs().add(30, "days").endOf("day");
        return current.isBefore(today, "day") || current.isAfter(maxDate, "day");
    };

    const getGroupedSlots = () => {
        const morning: string[] = [];
        const afternoon: string[] = [];
        const evening: string[] = [];

        availableSlots.forEach((slot) => {
            const hour = parseInt(slot.split(":")[0]);
            if (hour < 12) {
                morning.push(slot);
            } else if (hour < 18) {
                afternoon.push(slot);
            } else {
                evening.push(slot);
            }
        });

        return { morning, afternoon, evening };
    };

    const { morning, afternoon, evening } = getGroupedSlots();

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Selecciona fecha y hora
                </h2>
                <p className="text-gray-600">Elige el día y horario de tu preferencia</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                            <CalendarOutlined className="text-gray-400 text-lg sm:text-xl" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Fecha</h3>
                        </div>
                        <p className="text-xs text-gray-400 ml-6">Disponible hasta {dayjs().add(30, "days").format("D [de] MMMM")}</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <Calendar
                            fullscreen={false}
                            value={selectedDate || undefined}
                            onSelect={onSelectDate}
                            disabledDate={disabledDate}
                            validRange={[dayjs().startOf("day"), dayjs().add(30, "days").endOf("day")]}
                            cellRender={(date) => {
                                const isToday = dayjs().isSame(date, "day");

                                return isToday ? (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 2,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: 4,
                                            height: 4,
                                            borderRadius: "50%",
                                            background: "var(--ant-primary-color)",
                                        }}
                                    />
                                ) : null;
                            }}
                        />
                    </div>
                </div>

                {/* Time Slots */}
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <ClockCircleOutlined className="text-gray-400 text-lg sm:text-xl" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Horario</h3>
                    </div>

                    {!selectedDate && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                            <CalendarOutlined className="text-4xl text-gray-300 mb-2" />
                            <p className="text-sm text-gray-600">Selecciona una fecha para ver horarios disponibles</p>
                        </div>
                    )}

                    {selectedDate && loading && (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <Spin size="large" />
                            <p className="text-gray-600 mt-4">Cargando horarios...</p>
                        </div>
                    )}

                    {selectedDate && !loading && availableSlots.length === 0 && (
                        <Alert
                            title="No hay horarios disponibles"
                            description="Intenta con otra fecha"
                            type="warning"
                            showIcon
                            className="rounded-xl"
                        />
                    )}

                    {selectedDate && !loading && availableSlots.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4 max-h-96 overflow-y-auto">
                            {morning.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-2 font-medium">Mañana</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {morning.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => onSelectSlot(slot)}
                                                className={`
                                                    px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                                    ${
                                                        selectedSlot === slot
                                                            ? "bg-[var(--ant-primary-color)] text-white shadow-sm"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                                                    }
                                                `}
                                            >
                                                {slot.substring(0, 5)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {afternoon.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-2 font-medium">Tarde</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {afternoon.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => onSelectSlot(slot)}
                                                className={`
                                                    px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                                    ${
                                                        selectedSlot === slot
                                                            ? "bg-[var(--ant-primary-color)] text-white shadow-sm"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                                                    }
                                                `}
                                            >
                                                {slot.substring(0, 5)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {evening.length > 0 && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-2 font-medium">Noche</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {evening.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => onSelectSlot(slot)}
                                                className={`
                                                    px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                                    ${
                                                        selectedSlot === slot
                                                            ? "bg-[var(--ant-primary-color)] text-white shadow-sm"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
                                                    }
                                                `}
                                            >
                                                {slot.substring(0, 5)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
