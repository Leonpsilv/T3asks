"use server";

import { redirect } from "next/navigation";
import { registerSchema, type RegisterInputType } from "~/schemas/register.schema";
import { auth } from "~/server/better-auth";

export async function registerAction(data: RegisterInputType) {
    const parsed = registerSchema.safeParse(data)

    if (!parsed.success) {
        throw new Error("Dados inválidos");
    }

    const { name, email, password } = parsed.data;

    const res = await auth.api.signUpEmail({
        returnHeaders: true,
        body: {
            name,
            email,
            password,
        },
    });

    if (!res?.response?.user) {
        throw new Error("Erro ao criar usuário");
    }
}
