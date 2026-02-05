"use server";

import { loginSchema, type LoginInputType } from "~/schemas/login.schema";
import { auth } from "~/server/better-auth";

type LoginActionResult =
    | { success: true }
    | { success: false; message: string };


export async function loginAction(data: LoginInputType): Promise<LoginActionResult> {
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            message: "Dados inválidos",
        };
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
        return {
            success: false,
            message: "E-mail ou senha incorretos",
        };
    }

    return { success: true };
}
