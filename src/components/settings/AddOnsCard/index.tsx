"use client";

import { useState, useEffect } from "react";
import { Card, Tag, Modal, Button, Spin } from "antd";
import { TeamOutlined, WhatsAppOutlined, BankOutlined, CheckCircleFilled } from "@ant-design/icons";
import { WHATSAPP_ADMIN, getWhatsAppURL } from "@/config/constants";
import { useAddons } from "@/features/subscriptions/addon/hooks/useAddons";

type AddonType = "whatsapp" | "professionals" | "branches";

const ADDON_CONFIG = {
  whatsapp: {
    title: "WhatsApp",
    icon: WhatsAppOutlined,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    description: "Envía notificaciones automáticas por WhatsApp",
    unit: "mensajes",
  },
  professionals: {
    title: "Profesionales",
    icon: TeamOutlined,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Amplía tu equipo de profesionales",
    unit: "profesionales",
  },
  branches: {
    title: "Sedes",
    icon: BankOutlined,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Gestiona múltiples sucursales",
    unit: "sedes",
  },
};

const AddOnsCard = () => {
  const { addons, loading, fetchAddons } = useAddons();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddon, setSelectedAddon] = useState<AddonType | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchAddons();
  }, []);

  const handleOpenModal = (type: AddonType) => {
    setSelectedAddon(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAddon(null);
    setSelectedId(null);
  };

  const handleRequest = () => {
    if (!selectedAddon || !selectedId) return;

    const config = ADDON_CONFIG[selectedAddon];
    const selectedOption = addons?.catalog[selectedAddon].find((a) => a.id === selectedId);
    if (!selectedOption) return;

    const message = `Hola! Quisiera solicitar el add-on de *${config.title}*.\n\nCantidad: ${selectedOption.quotaAmount} ${config.unit}\nPrecio: ${selectedOption.price}\n\nPor favor, envíame más información sobre cómo proceder.`;

    window.open(getWhatsAppURL(WHATSAPP_ADMIN, message), "_blank");
    handleCloseModal();
  };

  const hasAddon = (type: AddonType) => {
    if (!addons) return false;
    if (type === "whatsapp") return addons.purchased.whatsapp.length > 0;
    return addons.purchased[type] !== null;
  };

  if (loading) {
    return (
      <Card className="shadow-sm mb-8">
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!addons) return null;

  return (
    <>
      <Card className="shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-2">Add-ons</h3>
        <p className="text-sm text-gray-500 mb-4">Amplía las capacidades de tu plan</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(ADDON_CONFIG) as AddonType[]).map((type) => {
            const config = ADDON_CONFIG[type];
            const Icon = config.icon;
            return (
              <div
                key={type}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${config.bgColor} p-2.5 rounded-lg`}>
                    <Icon className={`${config.iconColor} text-2xl`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{config.title}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{config.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    {hasAddon(type) ? (
                      <Tag color="success" icon={<CheckCircleFilled />} className="m-0">
                        Tienes
                      </Tag>
                    ) : (
                      <Tag color="default" className="m-0">
                        No tienes
                      </Tag>
                    )}
                  </div>
                  <Button type="link" className="p-0 h-auto" onClick={() => handleOpenModal(type)}>
                    Obtener
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Modal
        title={`Obtener ${selectedAddon ? ADDON_CONFIG[selectedAddon].title : ""}`}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={500}
      >
        {selectedAddon && (
          <div className="py-4">
            <p className="text-gray-600 mb-6">
              Selecciona la cantidad que deseas agregar a tu plan
            </p>

            <div className="space-y-3">
              {addons.catalog[selectedAddon].map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedId(option.id)}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-pointer ${
                    selectedId === option.id
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {option.quotaAmount} {ADDON_CONFIG[selectedAddon].unit}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">S/. {option.price}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button
                type="primary"
                size="large"
                block
                disabled={selectedId === null}
                onClick={handleRequest}
                icon={<WhatsAppOutlined />}
              >
                Solicitar adicional
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AddOnsCard;
