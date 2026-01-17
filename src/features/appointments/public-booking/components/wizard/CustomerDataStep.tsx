"use client";

import React from "react";
import { Form, Input, Button } from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CheckCircleOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    MedicineBoxOutlined,
} from "@ant-design/icons";
import { PublicService, PublicProfessional, PublicBranch } from "../../types/public-booking.types";
import dayjs, { Dayjs } from "dayjs";
import Image from "next/image";

const { TextArea } = Input;

interface CustomerDataStepProps {
    selectedService: PublicService | null;
    selectedDate: Dayjs | null;
    selectedSlot: string | null;
    selectedProfessional: PublicProfessional | null;
    selectedBranch: PublicBranch | null;
    loading: boolean;
    onSubmit: (values: any) => void;
}

export const CustomerDataStep: React.FC<CustomerDataStepProps> = ({
    selectedService,
    selectedDate,
    selectedSlot,
    selectedProfessional,
    selectedBranch,
    loading,
    onSubmit,
}) => {
    return (
        <div className="w-full">
            <div className="text-center mb-4 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
                    Completa tus datos
                </h2>
                <p className="text-sm sm:text-base text-gray-600">Confirma tu reserva con tu información de contacto</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                {/* Summary Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-6 border border-gray-200 lg:sticky lg:top-4">
                        <h3 className="font-semibold text-sm sm:text-lg text-gray-900 mb-2 sm:mb-4">Resumen de tu cita</h3>

                        <div className="space-y-2 sm:space-y-4">
                            {/* Professional */}
                            {selectedProfessional && (
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                        {selectedProfessional.profile_photo ? (
                                            <Image
                                                src={selectedProfessional.profile_photo}
                                                alt={selectedProfessional.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <UserOutlined className="text-lg sm:text-xl text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Profesional</p>
                                        <p className="font-medium text-sm sm:text-base text-gray-800">
                                            {selectedProfessional.name} {selectedProfessional.last_name}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Service */}
                            {selectedService && (
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="bg-blue-50 rounded-lg p-2 flex-shrink-0">
                                        <MedicineBoxOutlined className="text-[var(--ant-primary-color)] text-base sm:text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Servicio</p>
                                        <p className="font-medium text-sm sm:text-base text-gray-800">{selectedService.name}</p>
                                        <p className="text-sm text-green-600 font-semibold">
                                            S/ {selectedService.price}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Date */}
                            {selectedDate && (
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="bg-green-50 rounded-lg p-2 flex-shrink-0">
                                        <CalendarOutlined className="text-green-600 text-base sm:text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Fecha</p>
                                        <p className="font-medium text-sm sm:text-base text-gray-800">
                                            {selectedDate.format("dddd, D [de] MMMM")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Time */}
                            {selectedSlot && (
                                <div className="flex items-start gap-2 sm:gap-3">
                                    <div className="bg-purple-50 rounded-lg p-2 flex-shrink-0">
                                        <ClockCircleOutlined className="text-purple-600 text-base sm:text-lg" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Hora</p>
                                        <p className="font-medium text-sm sm:text-base text-gray-800">
                                            {selectedSlot.substring(0, 5)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Branch */}
                            {selectedBranch && (
                                <div className="pt-2 sm:pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1">Sucursal</p>
                                    <p className="font-medium text-sm sm:text-base text-gray-800 mb-1">{selectedBranch.name}</p>
                                    {selectedBranch.address && (
                                        <p className="text-xs text-gray-600">{selectedBranch.address}</p>
                                    )}
                                    {selectedBranch.phone && (
                                        <p className="text-xs text-gray-600">{selectedBranch.phone}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6">
                        <Form
                            layout="vertical"
                            onFinish={onSubmit}
                            size="large"
                            className="[&_.ant-form-item]:mb-3 sm:[&_.ant-form-item]:mb-6"
                            initialValues={(() => {
                                const savedData = localStorage.getItem("citalisto_user_data");
                                if (savedData) {
                                    try {
                                        return JSON.parse(savedData);
                                    } catch {
                                        return {};
                                    }
                                }
                                return {};
                            })()}
                        >
                            <Form.Item
                                name="full_name"
                                label="Nombre completo"
                                rules={[{ required: true, message: "El nombre es requerido" }]}
                                className="!mb-3 sm:!mb-4"
                            >
                                <Input
                                    prefix={<UserOutlined className="text-gray-400" />}
                                    placeholder="Juan Pérez"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4 [&_.ant-form-item]:mb-0">
                                <Form.Item
                                    name="phone"
                                    label="Teléfono"
                                    rules={[
                                        { required: true, message: "El teléfono es requerido" },
                                        {
                                            pattern: /^[0-9]{9}$/,
                                            message: "El teléfono debe tener 9 dígitos",
                                        },
                                    ]}
                                    className="!mb-3 sm:!mb-0"
                                >
                                    <Input
                                        prefix={<PhoneOutlined className="text-gray-400" />}
                                        placeholder="999888777"
                                        maxLength={9}
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: "El email es requerido" },
                                        { type: "email", message: "Email inválido" },
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined className="text-gray-400" />}
                                        placeholder="juan@example.com"
                                        className="rounded-lg"
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item name="notes" label="Notas (opcional)" className="!mb-4 sm:!mb-6">
                                <TextArea
                                    rows={3}
                                    placeholder="Algo que debamos saber..."
                                    className="rounded-lg"
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>

                            <Button
                                type="primary"
                                size="large"
                                block
                                htmlType="submit"
                                loading={loading}
                                icon={<CheckCircleOutlined />}
                                className="h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-lg"
                            >
                                Confirmar reserva
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};
