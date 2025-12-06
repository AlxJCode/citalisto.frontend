import { NextResponse } from "next/server";
import { removeSession } from "@/lib/auth";

export async function POST() {
    try {
        await removeSession();
        return NextResponse.json({ success: true, message: "Sesión cerrada" });
    } catch (error) {
        console.error("Error during logout:", error);
        return NextResponse.json(
            { success: false, message: "Error al cerrar sesión" },
            { status: 500 }
        );
    }
}
