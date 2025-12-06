"use client";

import { createContext, useContext, ReactNode } from "react";
import { SessionUser } from "@/lib/auth/types";

const SessionContext = createContext<SessionUser | null>(null);

export const SessionProvider = ({
    user,
    children,
}: {
    user: SessionUser | null;
    children: ReactNode;
}) => {
    return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
    const user = useContext(SessionContext);
    return user;
};
