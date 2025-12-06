"use client";

import { Button, Card } from "antd";
import Link from "next/link";
import { WhatsAppOutlined, LoginOutlined } from "@ant-design/icons";

export const CitaListoIntro = () => {
    return (
        <div className="w-full flex justify-center mt-20 px-4">
            <Card className="max-w-lg w-full shadow-lg p-6 rounded-xl text-center" bordered>
                {/* Título */}
                <h1 className="text-3xl font-bold text-gray-900">CitaListo</h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Tu agenda inteligente para gestionar citas sin complicarte.
                </p>

                {/* Beneficios */}
                <div className="mt-5 space-y-1 text-gray-700 text-sm">
                    <p>✔ Agenda automática por WhatsApp</p>
                    <p>✔ Recordatorios inteligentes</p>
                    <p>✔ Panel intuitivo para tus clientes</p>
                </div>

                {/* Botones */}
                <div className="flex flex-col gap-3 mt-8">
                    <Link href="/login">
                        <Button
                            type="primary"
                            size="large"
                            icon={<LoginOutlined />}
                            className="w-full"
                        >
                            Iniciar sesión
                        </Button>
                    </Link>

                    <Link
                        href="https://wa.me/51900000000?text=Hola,%20quiero%20probar%20CitaListo%20😊"
                        target="_blank"
                    >
                        <Button
                            size="large"
                            icon={<WhatsAppOutlined />}
                            className="w-full bg-green-500 text-white hover:bg-green-600"
                        >
                            Solicitar demo por WhatsApp
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};
