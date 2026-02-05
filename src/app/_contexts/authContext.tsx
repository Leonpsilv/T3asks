"use client";

import { createContext, useContext } from "react";
import type { IUsers } from "../_types/users.types";

type AuthContextType = {
    user: IUsers | undefined;
};

interface ISession {
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
    };
    user: IUsers
}

interface AuthProviderProps {
    session: ISession | null;
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    session,
    children,
}: AuthProviderProps) {
    return (
        <AuthContext.Provider value={{ user: session?.user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
}
