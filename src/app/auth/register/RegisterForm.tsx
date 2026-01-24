"use client"

import { registerAction } from "./actions";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function LoginForm() {
    const [registerErrorMsg, setRegisterErrorMsg] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    async function register(formData: FormData) {
        try {
            setLoading(true);
            setRegisterErrorMsg(undefined);

            const name = String(formData.get("name"));
            const email = String(formData.get("email"));
            const password = String(formData.get("password"));

            await registerAction({
                name,
                email,
                password
            });

        } catch (error) {
            console.log({ error })
            setRegisterErrorMsg("Falha ao realizar cadastro");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm rounded-xl bg-white/10 p-8 text-white shadow-xl space-y-6">
            <h1 className="text-center text-3xl font-bold">T3asks</h1>

            <h3 className="text-center text-2xl font-light">
                Crie a sua conta
            </h3>

            {/* CADASTRO */}
            <form action={register} className="space-y-4">
                <input
                    name="name"
                    placeholder="Nome"
                    required
                    className="w-full rounded-md px-4 py-2 text-black"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full rounded-md px-4 py-2 text-black"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Senha"
                    required
                    className="w-full rounded-md px-4 py-2 text-black"
                />

                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirme a senha"
                    required
                    className="w-full rounded-md px-4 py-2 text-black"
                />

                {!!registerErrorMsg && <span>{registerErrorMsg}</span>}
                <button className="w-full rounded-md bg-blue-600 py-2 font-semibold hover:bg-blue-700">
                    Criar conta
                </button>
            </form>

            <hr className="border-white/20" />

            <span>Já possui uma conta? <span onClick={() => redirect("/auth/login")}> Faça login aqui.</span></span>
        </div>
    );
}
