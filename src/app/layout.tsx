import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { LoaderProvider } from "@/providers/LoaderProvider";
import { NavigationLoader } from "@/components/providers/NavigationLoader";
import { LinkInterceptor } from "@/components/providers/LinkInterceptor";
import { SessionProvider } from "@/providers/SessionProvider";
import { AntdConfigProvider } from "@/providers/AntdConfigProvider";
import { getSession } from "@/lib/auth";
import "@/lib/dayjs/config";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "Citalisto",
    description: "Sistema de gestión de citas para consultorios dentales",
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getSession()

    return (
        <html lang="es">
            <body suppressHydrationWarning className={`${inter.variable} antialiased`}>
                <AntdConfigProvider>
                    <SessionProvider user={session}>
                        <LoaderProvider>
                            <Suspense fallback={null}>
                                <NavigationLoader />
                            </Suspense>
                            <LinkInterceptor />
                            {children}
                        </LoaderProvider>
                    </SessionProvider>
                </AntdConfigProvider>
            </body>
        </html>
    );
}
