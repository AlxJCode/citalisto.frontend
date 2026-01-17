"use client";

import React, { useState, useMemo } from "react";
import { CheckCircleOutlined, ClockCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { PublicService } from "../../types/public-booking.types";
import Image from "next/image";

interface ServiceSelectionStepProps {
    services: PublicService[];
    selectedServiceId: string | null;
    onSelectService: (serviceId: string) => void;
}

export const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
    services,
    selectedServiceId,
    onSelectService,
}) => {
    const activeServices = services;
    const [searchTerm, setSearchTerm] = useState("");

    const filteredServices = useMemo(() => {
        if (!searchTerm.trim()) return activeServices;

        const search = searchTerm.toLowerCase();
        return activeServices.filter(
            (service) =>
                service.name.toLowerCase().includes(search) ||
                service.description?.toLowerCase().includes(search)
        );
    }, [activeServices, searchTerm]);

    const showSearch = activeServices.length > 9;

    return (
        <div className="w-full">
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                    Selecciona un servicio
                </h2>
                <p className="text-sm sm:text-base text-gray-600">Elige el servicio que necesitas</p>
            </div>

            {showSearch && (
                <div className="mb-6">
                    <Input
                        size="large"
                        placeholder="Buscar servicio..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        className="max-w-md mx-auto"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {filteredServices.map((service) => {
                    const isSelected = selectedServiceId === service.id;

                    return (
                        <button
                            key={service.id}
                            onClick={() => onSelectService(service.id)}
                            className={`
                                relative group rounded-lg overflow-hidden transition-all duration-200
                                border-2 cursor-pointer text-left
                                ${
                                    isSelected
                                        ? "border-[var(--ant-primary-color)] shadow-md ring-2 ring-blue-50"
                                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                }
                            `}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 z-10 bg-[var(--ant-primary-color)] text-white rounded-full p-1.5 shadow-md">
                                    <CheckCircleOutlined className="text-sm sm:text-base" />
                                </div>
                            )}

                            <div className="relative w-full h-40 sm:h-44 md:h-48 bg-gray-50">
                                {service.image ? (
                                    <Image
                                        src={service.image}
                                        alt={service.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ClockCircleOutlined className="text-4xl sm:text-5xl text-gray-300" />
                                    </div>
                                )}
                            </div>

                            <div className="p-3 sm:p-4">
                                <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2 line-clamp-1">
                                    {service.name}
                                </h3>

                                {service.description && (
                                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-1">
                                        {service.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                        <ClockCircleOutlined />
                                        {service.duration_minutes} min
                                    </span>
                                    <span className="text-lg sm:text-xl font-bold text-[var(--ant-primary-color)]">
                                        S/ {service.price}
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {filteredServices.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        {searchTerm ? "No se encontraron servicios" : "No hay servicios disponibles en este momento"}
                    </p>
                </div>
            )}
        </div>
    );
};
