"use client";

import React, { useState, useEffect } from "react";
import { Spin, Result, Alert, Button } from "antd";
import { WarningOutlined, LeftOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { usePublicBooking } from "../hooks/usePublicBooking";
import type {
    PublicProfessional,
    PublicService,
    CreatePublicBookingPayload,
    PublicBranch,
    PublicBookingResponse,
} from "../types/public-booking.types";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import Image from "next/image";
import { StepIndicator } from "./wizard/StepIndicator";
import { ServiceSelectionStep } from "./wizard/ServiceSelectionStep";
import { DateTimeSelectionStep } from "./wizard/DateTimeSelectionStep";
import { CustomerDataStep } from "./wizard/CustomerDataStep";
import { ConfirmationStep } from "./wizard/ConfirmationStep";

dayjs.locale("es");

interface PublicBookingWidgetProps {
    businessSlug: string;
    queryParams: {
        [key: string]: string | string[] | undefined;
    };
}

type ValidationState = "loading" | "valid" | "invalid" | "missing_params";

const STEPS = [
    { number: 1, title: "Servicio" },
    { number: 2, title: "Fecha y Hora" },
    { number: 3, title: "Tus Datos" },
];

export function PublicBookingWidget({ businessSlug, queryParams }: PublicBookingWidgetProps) {
    const { loading, getProfessionals, getAvailability, createBooking, getBranches } =
        usePublicBooking(businessSlug);

    const [validationState, setValidationState] = useState<ValidationState>("loading");
    const [selectedBranch, setSelectedBranch] = useState<PublicBranch | null>(null);
    const [selectedProfessional, setSelectedProfessional] = useState<PublicProfessional | null>(null);

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedService, setSelectedService] = useState<PublicService | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [confirmationData, setConfirmationData] = useState<PublicBookingResponse | null>(null);

    useEffect(() => {
        validateAndLoadInitialData();
    }, []);

    useEffect(() => {
        if (selectedProfessional && selectedService && selectedDate) {
            loadAvailability();
        }
    }, [selectedProfessional, selectedService, selectedDate]);

    const validateAndLoadInitialData = async () => {
        setValidationState("loading");

        const branchId = Array.isArray(queryParams.branch)
            ? queryParams.branch[0]
            : queryParams.branch;
        const professionalId = Array.isArray(queryParams.professional)
            ? queryParams.professional[0]
            : queryParams.professional;

        if (!branchId || !professionalId) {
            setValidationState("missing_params");
            return;
        }

        try {
            const branchesResult = await getBranches();
            if (!branchesResult.success || !branchesResult.data) {
                setValidationState("invalid");
                return;
            }

            const branch = branchesResult.data.find((b: PublicBranch) => b.id === branchId);
            if (!branch) {
                setValidationState("invalid");
                return;
            }

            const professionalsResult = await getProfessionals(branchId);
            if (!professionalsResult.success || !professionalsResult.data) {
                setValidationState("invalid");
                return;
            }

            const professional = professionalsResult.data.find(
                (p: PublicProfessional) => p.id === professionalId
            );
            if (!professional) {
                setValidationState("invalid");
                return;
            }

            setSelectedBranch(branch);
            setSelectedProfessional(professional);
            setValidationState("valid");
        } catch (error) {
            console.error("Error validating params:", error);
            setValidationState("invalid");
        }
    };

    const loadAvailability = async () => {
        if (!selectedProfessional || !selectedService || !selectedDate) return;

        const result = await getAvailability(
            selectedProfessional.id,
            selectedService.id,
            selectedDate.format("YYYY-MM-DD")
        );

        if (result.success && result.data) {
            setAvailableSlots(result.data.slots);
        }
    };

    const handleServiceSelect = (serviceId: string) => {
        const service = selectedProfessional?.services.find((s) => s.id === serviceId);
        setSelectedService(service || null);
    };

    const handleDateSelect = (date: Dayjs) => {
        const today = dayjs().startOf("day");
        const maxDate = dayjs().add(30, "days").endOf("day");

        if (date.isBefore(today) || date.isAfter(maxDate)) return;

        setSelectedDate(date);
        setSelectedSlot(null);
    };

    const handleSlotSelect = (slot: string) => {
        setSelectedSlot(slot);
    };

    const handleCustomerDataSubmit = async (values: any) => {
        if (!selectedProfessional || !selectedService || !selectedDate || !selectedSlot) return;

        const userData = {
            full_name: values.full_name,
            email: values.email,
            phone: values.phone,
        };
        localStorage.setItem("citalisto_user_data", JSON.stringify(userData));

        const payload: CreatePublicBookingPayload = {
            professional_id: selectedProfessional.id,
            service_id: selectedService.id,
            date: selectedDate.format("YYYY-MM-DD"),
            start_time: selectedSlot,
            full_name: values.full_name,
            email: values.email,
            phone: values.phone,
            notes: values.notes,
        };

        const result = await createBooking(payload);

        if (result.success && result.data) {
            setConfirmationData(result.data);
            setCurrentStep(4);
        }
    };

    const canProceedToStep2 = selectedService !== null;
    const canProceedToStep3 = selectedDate !== null && selectedSlot !== null;

    const handleNextStep = () => {
        if (currentStep === 1 && canProceedToStep2) {
            setCurrentStep(2);
            setSelectedDate(dayjs());
        } else if (currentStep === 2 && canProceedToStep3) {
            setCurrentStep(3);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderHeader = () => (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-5xl mx-auto flex items-stretch">
                {/* Left: Professional Photo & Business/Professional Names */}
                <div className="flex-1 p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
                    {/* Column 1: Professional Avatar - Larger */}
                    {selectedProfessional && (
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                            {selectedProfessional.profile_photo ? (
                                <Image
                                    src={selectedProfessional.profile_photo}
                                    alt={`${selectedProfessional.name} ${selectedProfessional.last_name}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold">
                                    {selectedProfessional.name.charAt(0)}
                                    {selectedProfessional.last_name.charAt(0)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Column 2: Business Name & Professional Name */}
                    <div className="flex-1 space-y-1">
                        {/* Row 1: Business Name */}
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                            {selectedBranch?.business_name || selectedBranch?.name}
                        </h1>

                        {/* Row 2: Professional Name */}
                        {selectedProfessional && (
                            <div>
                                <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 leading-tight">
                                    {selectedProfessional.name} {selectedProfessional.last_name}
                                </p>
                                {selectedProfessional.description && (
                                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mt-0.5">
                                        {selectedProfessional.description}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Branch Info - Below */}
                        {selectedBranch && (
                            <div className="flex items-start gap-1.5 pt-1">
                                <EnvironmentOutlined className="text-gray-400 text-xs sm:text-sm mt-0.5 flex-shrink-0" />
                                <div className="text-xs sm:text-sm">
                                    <span className="font-medium text-gray-700">{selectedBranch.name}</span>
                                    {selectedBranch.address && (
                                        <span className="text-gray-500 ml-1">• {selectedBranch.address}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Business Logo - Full Height Square */}
                <div className="relative w-[164px] h-[164px] bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                    {selectedBranch?.business_logo ? (
                        <Image
                            src={selectedBranch.business_logo}
                            alt={selectedBranch.business_name || "Logo"}
                            fill
                            className="object-cover"
                            sizes="164px"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-bold">
                            {(selectedBranch?.business_name || selectedBranch?.name || "").charAt(0)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );


    const renderLoadingState = () => (
        <div className="text-center py-16">
            <Spin size="large" />
            <p className="text-gray-600 mt-6">Validando información...</p>
        </div>
    );

    const renderMissingParamsError = () => (
        <div className="max-w-lg mx-auto text-center py-12">
            <WarningOutlined className="text-6xl text-yellow-500 mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                Enlace incompleto
            </h2>
            <p className="text-gray-600 mb-6">
                Parece que falta información en el enlace. Para poder reservar una cita, necesitamos
                que el enlace incluya tanto la sucursal como el profesional.
            </p>
            <Alert
                title="¿Qué puedes hacer?"
                description={
                    <ul className="text-left list-disc pl-5 space-y-1">
                        <li>Verifica que copiaste el enlace completo</li>
                        <li>Contacta con la clínica para obtener un nuevo enlace</li>
                        <li>Solicita ayuda al personal</li>
                    </ul>
                }
                type="info"
                showIcon
                className="text-left"
            />
        </div>
    );

    const renderInvalidDataError = () => (
        <div className="max-w-lg mx-auto text-center py-12">
            <WarningOutlined className="text-6xl text-red-500 mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                Enlace no válido
            </h2>
            <p className="text-gray-600 mb-6">
                Lo sentimos, no pudimos encontrar la información de la sucursal o el profesional
                asociados a este enlace.
            </p>
            <Alert
                title="¿Qué puedes hacer?"
                description={
                    <ul className="text-left list-disc pl-5 space-y-1">
                        <li>Es posible que el enlace haya expirado</li>
                        <li>El profesional o la sucursal ya no estén disponibles</li>
                        <li>Por favor, contacta con la clínica para obtener un nuevo enlace</li>
                    </ul>
                }
                type="error"
                showIcon
                className="text-left"
            />
        </div>
    );

    if (validationState === "loading") {
        return (
            <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
                <div className="max-w-5xl mx-auto bg-white shadow-sm">
                    {renderLoadingState()}
                </div>
            </div>
        );
    }

    if (validationState === "missing_params") {
        return (
            <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
                <div className="max-w-5xl mx-auto bg-white shadow-sm p-8">
                    {renderMissingParamsError()}
                </div>
            </div>
        );
    }

    if (validationState === "invalid") {
        return (
            <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
                <div className="max-w-5xl mx-auto bg-white shadow-sm p-8">
                    {renderInvalidDataError()}
                </div>
            </div>
        );
    }

    if (currentStep === 4 && confirmationData) {
        return (
            <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
                <div className="max-w-5xl mx-auto bg-white shadow-sm">
                    {renderHeader()}
                    <div className="p-4 sm:p-6 md:p-12">
                        <ConfirmationStep confirmationData={confirmationData} />
                    </div>

                    {/* CitaListo Footer */}
                    <div className="border-t border-gray-100 py-4 px-4 sm:px-6">
                        <div className="max-w-5xl mx-auto text-center">
                            <p className="text-xs text-gray-400">
                                Powered by <span className="font-medium text-gray-500">CitaListo</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="max-w-5xl mx-auto bg-white shadow-sm">
                {renderHeader()}

                <div className="p-3 sm:p-6 md:p-8">
                    <StepIndicator currentStep={currentStep} steps={STEPS} />

                    <div className="mt-4 sm:mt-6 md:mt-8">
                        {currentStep === 1 && selectedProfessional && (
                            <ServiceSelectionStep
                                services={selectedProfessional.services}
                                selectedServiceId={selectedService?.id || null}
                                onSelectService={handleServiceSelect}
                            />
                        )}

                        {currentStep === 2 && (
                            <DateTimeSelectionStep
                                selectedDate={selectedDate}
                                selectedSlot={selectedSlot}
                                availableSlots={availableSlots}
                                loading={loading}
                                onSelectDate={handleDateSelect}
                                onSelectSlot={handleSlotSelect}
                            />
                        )}

                        {currentStep === 3 && (
                            <CustomerDataStep
                                selectedService={selectedService}
                                selectedDate={selectedDate}
                                selectedSlot={selectedSlot}
                                selectedProfessional={selectedProfessional}
                                selectedBranch={selectedBranch}
                                loading={loading}
                                onSubmit={handleCustomerDataSubmit}
                            />
                        )}
                    </div>

                    {currentStep < 3 && (
                        <div className="mt-4 sm:mt-6 md:mt-8 flex items-center justify-between gap-3 sm:gap-4">
                            <Button
                                size="large"
                                icon={<LeftOutlined />}
                                onClick={handlePreviousStep}
                                disabled={currentStep === 1}
                                className="px-4 sm:px-6"
                            >
                                Atrás
                            </Button>

                            <Button
                                type="primary"
                                size="large"
                                onClick={handleNextStep}
                                disabled={
                                    (currentStep === 1 && !canProceedToStep2) ||
                                    (currentStep === 2 && !canProceedToStep3)
                                }
                                className="px-6 sm:px-8"
                            >
                                Continuar
                            </Button>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="mt-4 sm:mt-6">
                            <Button
                                size="large"
                                icon={<LeftOutlined />}
                                onClick={handlePreviousStep}
                                className="px-4 sm:px-6"
                            >
                                Atrás
                            </Button>
                        </div>
                    )}
                </div>

                {/* CitaListo Footer - Subtle branding */}
                <div className="border-t border-gray-100 py-4 px-4 sm:px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <p className="text-xs text-gray-400">
                            Powered by <span className="font-medium text-gray-500">CitaListo</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
