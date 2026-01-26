"use client"

import { loginAction } from "./actions";
import { useState } from "react";
import { FieldGroup } from "~/components/ui/field";
import { SimpleInput } from "~/app/_components/SimpleInput";
import { loginSchema } from "~/schemas/auth";

export default function LoginForm() {
    const [loginErrorMsg, setLoginErrorMsg] = useState<string | undefined>();

    const [emailOk, setEmailOk] = useState<"untouched" | "ok" | "error">("untouched");
    const [emailErrorMsg, setEmailErrorMsg] = useState<string | undefined>();

    const [passwordOk, setPasswordOk] = useState<"untouched" | "ok" | "error">("untouched");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | undefined>();
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

    function validateEmail(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event?.target?.value;

        const emailValidationSchema = loginSchema.shape.email;
        const result = emailValidationSchema.safeParse(value);

        if (!result.success) {
            const errors = result.error.flatten().formErrors;
            setEmailErrorMsg(errors[0]);
            setEmailOk("error")
            return;
        }

        setEmailOk("ok")
        setEmailErrorMsg(undefined);
    }

    function validatePassword(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event?.target?.value;

        const passwordValidationSchema = loginSchema.shape.password;
        const result = passwordValidationSchema.safeParse(value);

        if (!result.success) {
            const errors = result.error.flatten().formErrors;
            setPasswordErrorMsg(errors[0]);
            setPasswordOk("error")
            return;
        }

        setPasswordOk("ok")
        setPasswordErrorMsg(undefined);
    }

    return (
        <div className="w-full max-w-sm rounded-xl bg-white/10 p-8 text-white shadow-xl space-y-6">
            <h1 className="text-center text-3xl font-bold font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e0e1d7] to-[#dff8a7]">T3asks</h1>

            <h3 className="text-center text-2xl font-light">
                Faça o seu login
            </h3>

            {/* LOGIN */}
            <form action={login} className="space-y-4">
                <FieldGroup>
                    <SimpleInput
                        onChange={validateEmail}
                        name="email"
                        type="email"
                        placeholder="Email"
                        title="Email"
                        errorMsg={emailErrorMsg}
                        required
                    />

                    <SimpleInput
                        onChange={validatePassword}
                        name="password"
                        type="password"
                        placeholder="Senha"
                        title="Senha"
                        errorMsg={passwordErrorMsg}
                        required
                    />
                </FieldGroup>
                <button
                    disabled={!(emailOk === "ok" && passwordOk === "ok")}
                    className="w-full rounded-md bg-white/20 py-2 font-semibold hover:bg-white/30"
                >
                    Entrar
                </button>
                {!!loginErrorMsg && <span>{loginErrorMsg}</span>}
            </form>

            <hr className="border-white/20" />

            <p>
                Ainda não possui uma conta?
                <a
                    href="/auth/register"
                    className="ml-[5px] underline"
                >
                    Faça seu cadastro aqui.
                </a>
            </p>
        </div>
    );
}
