"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "~/schemas/auth.schema";
import { auth } from "~/server/better-auth";

export interface loginDataDTO {
    email: string;
    password: string;
}

export async function loginAction(data: loginDataDTO) {
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        throw new Error("Dados inválidos");
    }

    const { email, password } = parsed.data

    const res = await auth.api.signInEmail({
        body: {
            email,
            password,
        },
        asResponse: true
    })

    if (!res.ok) {
        throw new Error("Falha ao realizar login");
    }

    redirect("/");
}
