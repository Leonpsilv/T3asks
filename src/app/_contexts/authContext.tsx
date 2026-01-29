"use client";

import { createContext, useContext } from "react";

type AuthContextType = {
    user: {
        id: string;
        name: string;
        email: string;
    };
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    session,
    children,
}: {
    session: any;
    children: React.ReactNode;
}) {
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
