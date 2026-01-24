"use client"

import { redirect } from "next/navigation";
import { loginAction } from "./actions";
import { useState } from "react";

export default function LoginForm() {
    const [loginErrorMsg, setLoginErrorMsg] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    async function login(formData: FormData) {
        try {
            setLoading(true);
            setLoginErrorMsg(undefined);

            const email = String(formData.get("email"));
            const password = String(formData.get("password"));

            await loginAction({
                email, password
            })

        } catch (error) {
            console.log({ error })
            setLoginErrorMsg("Falha ao realizar login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-sm rounded-xl bg-white/10 p-8 text-white shadow-xl space-y-6">
            <h1 className="text-center text-3xl font-bold">T3asks</h1>

            <h3 className="text-center text-2xl font-light">
                Faça o seu login
            </h3>

            {/* LOGIN */}
            <form action={login} className="space-y-4">
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
                <button className="w-full rounded-md bg-white/20 py-2 font-semibold hover:bg-white/30">
                    Entrar
                </button>
                {!!loginErrorMsg && <span>{loginErrorMsg}</span>}
            </form>

            <hr className="border-white/20" />

            <span>Ainda não possui uma conta? <span onClick={() => redirect("/auth/register")}> Faça seu cadastro aqui.</span></span>
        </div>
    );
}
