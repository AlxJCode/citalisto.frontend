"use client";

import { useState } from "react";
import { Card, Switch, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Business } from "@/features/organizations/business/types/business.types";
import { useBusinesses } from "@/features/organizations/business/hooks/useBusinesses";
import { ConfirmationModal } from "../ConfirmationModal";

interface EmailNotificationsCardProps {
    business: Business;
    onUpdate: () => void;
}

export const EmailNotificationsCard = ({ business, onUpdate }: EmailNotificationsCardProps) => {
    const { updateBusiness } = useBusinesses();
    const [loading, setLoading] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        open: boolean;
        field: keyof Business;
        value: boolean;
        title: string;
        description: string;
    } | null>(null);

    const handleSwitchChange = (field: keyof Business, currentValue: boolean) => {
        const configs = {
            enableEmailOnBooking: {
                title: currentValue ? "Desactivar email al agendar" : "Activar email al agendar",
                description: currentValue
                    ? "Los clientes NO recibirán un email de confirmación cuando agenden una cita. Solo verán la confirmación en pantalla."
                    : "Los clientes recibirán un email de confirmación inmediatamente después de agendar una cita con los detalles de su reserva.",
            },
            enableEmailReminder24h: {
                title: currentValue ? "Desactivar recordatorio 1 día antes" : "Activar recordatorio 1 día antes",
                description: currentValue
                    ? "Los clientes NO recibirán un email recordatorio un día antes de su cita a las 10:00 AM."
                    : "Los clientes recibirán un email recordatorio automáticamente un día antes de su cita a las 10:00 AM con los detalles de su reserva.",
            },
            enableEmailReminder2h: {
                title: currentValue ? "Desactivar recordatorio 2 horas antes" : "Activar recordatorio 2 horas antes",
                description: currentValue
                    ? "Los clientes NO recibirán un email recordatorio 2 horas antes de su cita."
                    : "Los clientes recibirán un email recordatorio automáticamente 2 horas antes de su cita para que no olviden su reserva.",
            },
        };

        const config = configs[field as keyof typeof configs];
        if (!config) return;

        setModalConfig({
            open: true,
            field,
            value: !currentValue,
            ...config,
        });
    };

    const handleConfirm = async () => {
        if (!modalConfig) return;

        setLoading(true);

        const fieldMap: Record<string, string> = {
            enableEmailOnBooking: 'enable_email_on_booking',
            enableEmailReminder24h: 'enable_email_reminder_24h',
            enableEmailReminder2h: 'enable_email_reminder_2h',
        };

        const snakeField = fieldMap[modalConfig.field as string];

        const result = await updateBusiness(business.id, {
            [snakeField]: modalConfig.value,
        });

        setLoading(false);

        if (result.success) {
            message.success("Configuración actualizada correctamente");
            onUpdate();
        }

        setModalConfig(null);
    };

    return (
        <>
            <Card className="mb-4" variant="borderless">
                <div className="flex items-center gap-3 mb-4">
                    <MailOutlined className="text-xl text-blue-600" />
                    <h3 className="text-lg font-semibold">Notificaciones por Email</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <div className="font-medium">Al agendar cita</div>
                            <div className="text-sm text-gray-500">
                                Enviar email de confirmación cuando se agenda una cita
                            </div>
                        </div>
                        <Switch
                            checked={business.enableEmailOnBooking}
                            onChange={() => handleSwitchChange("enableEmailOnBooking", business.enableEmailOnBooking)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <div className="font-medium">Recordatorio 1 día antes</div>
                            <div className="text-sm text-gray-500">
                                Enviar recordatorio un día antes a las 10:00 AM
                            </div>
                        </div>
                        <Switch
                            checked={business.enableEmailReminder24h}
                            onChange={() => handleSwitchChange("enableEmailReminder24h", business.enableEmailReminder24h)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <div className="font-medium">Recordatorio 2 horas antes</div>
                            <div className="text-sm text-gray-500">
                                Enviar recordatorio 2 horas antes de la cita
                            </div>
                        </div>
                        <Switch
                            checked={business.enableEmailReminder2h}
                            onChange={() => handleSwitchChange("enableEmailReminder2h", business.enableEmailReminder2h)}
                        />
                    </div>
                </div>
            </Card>

            {modalConfig && (
                <ConfirmationModal
                    open={modalConfig.open}
                    title={modalConfig.title}
                    description={modalConfig.description}
                    onConfirm={handleConfirm}
                    onCancel={() => setModalConfig(null)}
                    loading={loading}
                />
            )}
        </>
    );
};
