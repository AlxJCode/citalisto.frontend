"use client";

import Link from "next/link";

export const CitaListoCard = () => {
    return (
        <div className="w-full max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-2xl border border-gray-100 text-center">
            {/* Título */}
            <h1 className="text-3xl font-bold text-gray-900">CitaListo</h1>
            <p className="text-gray-600 mt-1 text-sm">Gestiona tus citas sin complicarte.</p>

            {/* Beneficios */}
            <div className="mt-6 space-y-2 text-gray-700">
                <p>✔ Agenda automática por WhatsApp</p>
                <p>✔ Recordatorios inteligentes</p>
                <p>✔ Panel simple para gestionar tus clientes</p>
            </div>

            {/* Botones */}
            <div className="mt-8 flex flex-col gap-3">
                <Link
                    href="/login"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                >
                    Iniciar sesión
                </Link>

                <a
                    href="https://wa.me/51900000000?text=Hola%20quiero%20probar%20CitaListo%20😊"
                    target="_blank"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition"
                >
                    Solicitar demo por WhatsApp
                </a>
            </div>
        </div>
    );
};
