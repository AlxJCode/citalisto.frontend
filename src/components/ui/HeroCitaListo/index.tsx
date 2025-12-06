"use client";

import Link from "next/link";
import { Button } from "antd";
import { LoginOutlined, WhatsAppOutlined } from "@ant-design/icons";

export const HeroCitaListo = () => {
    return (
        <section className="flex flex-col items-center text-center px-6 pt-28 pb-32 gap-8">
            {/* TITULOS */}
            <div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                    Agenda. Gestiona.
                </h1>

                <h2 className="text-5xl md:text-6xl font-extrabold text-gray-400 leading-tight mt-3">
                    Crece Fácil.
                </h2>
            </div>

            {/* SUBTITULO (sin margin collapse) */}
            <div className="max-w-2xl mx-auto mt-10">
                <p className="text-lg text-gray-600">
                    La plataforma inteligente que organiza tus citas, recuerda a tus clientes
                    automáticamente y te ayuda a hacer crecer tu negocio sin complicaciones.
                </p>
            </div>

            {/* BOTONES */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
                <Link href="/login">
                    <Button
                        type="primary"
                        size="large"
                        icon={<LoginOutlined />}
                        className="px-10 py-6 text-lg flex items-center justify-center"
                    >
                        Iniciar sesión
                    </Button>
                </Link>

                <a
                    href="https://wa.me/51900000000?text=Hola%20quiero%20probar%20CitaListo%20😊"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        size="large"
                        icon={<WhatsAppOutlined />}
                        className="px-10 py-6 text-lg flex items-center justify-center bg-green-500 text-white hover:bg-green-600 border-none"
                    >
                        Solicitar demo por WhatsApp
                    </Button>
                </a>
            </div>
        </section>
    );
};
