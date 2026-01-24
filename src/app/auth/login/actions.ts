"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/server/better-auth";
import { authClient } from "~/server/better-auth/client";

export interface loginDataDTO {
    email: string;
    password: string;
}

export interface registerDataDTO {
    email: string;
    password: string;
    name: string;
}

export async function loginAction(data: loginDataDTO) {
    const { email, password } = data

    const res = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
        asResponse: true
    })

    // if (!res.ok) {
    //     throw new Error("Credenciais inválidas");
    // }

    redirect("/");
}
