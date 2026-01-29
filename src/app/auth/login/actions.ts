"use server";

import { redirect } from "next/navigation";
import { loginSchema, type LoginInputType } from "~/schemas/login.schema";
import { auth } from "~/server/better-auth";


export async function loginAction(data: LoginInputType) {
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
        throw new Error("Email ou senha incorretos");
    }

    redirect("/");
}
