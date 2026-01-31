"use client";

import { createContext, useContext } from "react";
import type { IUsers } from "../_types/users.types";

type AuthContextType = {
    user: IUsers;
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
