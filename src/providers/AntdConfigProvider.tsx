"use client";

import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
import dayjs from "dayjs";
import "dayjs/locale/es";

// Configurar dayjs globalmente en español
dayjs.locale("es");

interface AntdConfigProviderProps {
    children: React.ReactNode;
}

export const AntdConfigProvider = ({ children }: AntdConfigProviderProps) => {
    return <ConfigProvider locale={esES}>{children}</ConfigProvider>;
};
