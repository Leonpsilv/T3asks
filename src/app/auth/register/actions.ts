"use server";

import { registerSchema, type RegisterInputType } from "~/schemas/register.schema";
import { auth } from "~/server/better-auth";

type RegisterActionResult =
    | { success: true }
    | { success: false; message: string };

export async function registerAction(data: RegisterInputType): Promise<RegisterActionResult> {
    const parsed = registerSchema.safeParse(data)

    if (!parsed.success) {
        return {
            success: false,
            message: "Dados inválidos",
        };
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
        return {
            success: false,
            message: "Erro ao criar usuário",
        };
    }

    return { success: true };
}
