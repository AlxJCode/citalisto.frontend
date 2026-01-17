"use client";

import React from "react";
import { CheckCircleOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, HomeOutlined } from "@ant-design/icons";
import { PublicBookingResponse } from "../../types/public-booking.types";

interface ConfirmationStepProps {
    confirmationData: PublicBookingResponse;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ confirmationData }) => {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircleOutlined className="text-5xl text-green-500" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                    ¡Reserva confirmada!
                </h2>
                <p className="text-gray-600 text-lg">
                    Tu cita ha sido agendada exitosamente. Recibirás un email de confirmación.
                </p>
            </div>

            <div className="bg-white rounded-xl border-2 border-green-200 p-6 sm:p-8 shadow-lg">
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Código de confirmación</p>
                    <p className="text-3xl font-bold text-green-600">
                        {confirmationData.confirmation_code}
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                            <CalendarOutlined className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Fecha</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {new Date(confirmationData.date).toLocaleDateString("es-PE", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-purple-100 rounded-lg p-3 flex-shrink-0">
                            <ClockCircleOutlined className="text-purple-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Horario</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {confirmationData.start_time.substring(0, 5)} -{" "}
                                {confirmationData.end_time.substring(0, 5)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-green-100 rounded-lg p-3 flex-shrink-0">
                            <UserOutlined className="text-green-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Profesional</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {confirmationData.professional_name}
                            </p>
                            <p className="text-sm text-gray-600">{confirmationData.service_name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-orange-100 rounded-lg p-3 flex-shrink-0">
                            <HomeOutlined className="text-orange-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Sucursal</p>
                            <p className="text-lg font-semibold text-gray-800">
                                {confirmationData.branch_name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                    <strong>Importante:</strong> Guarda tu código de confirmación. Lo necesitarás
                    si deseas cancelar o modificar tu cita.
                </p>
            </div>
        </div>
    );
};
