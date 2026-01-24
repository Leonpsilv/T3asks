"use server";

import { redirect } from "next/navigation";
import { auth } from "~/server/better-auth";

export interface loginDataDTO {
    email: string;
    password: string;
}

export interface registerDataDTO {
    email: string;
    password: string;
    name: string;
}

export async function registerAction(data: registerDataDTO) {
    const { name, email, password } = data

    const res = await auth.api.signUpEmail({
        returnHeaders: true,
        body: {
            name,
            email,
            password,
        },
    });

    if (!res?.response?.token) {
        throw new Error("Erro ao criar usuário");
    }

    redirect("/");
}
