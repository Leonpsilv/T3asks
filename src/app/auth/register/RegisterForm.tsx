"use client"

import { registerAction } from "./actions";
import { useState } from "react";
import { redirect } from "next/navigation";
import { SimpleInput } from "~/app/_components/SimpleInput";
import { FieldGroup } from "~/components/ui/field";
import { registerSchema } from "~/schemas/auth";

export default function LoginForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const [registerErrorMsg, setRegisterErrorMsg] = useState<string | undefined>();
    
    const [nameOk, setNameOk] = useState<"untouched" | "ok" | "error">("untouched");
    const [nameErrorMsg, setNameErrorMsg] = useState<string | undefined>();
    
    const [emailOk, setEmailOk] = useState<"untouched" | "ok" | "error">("untouched");
    const [emailErrorMsg, setEmailErrorMsg] = useState<string | undefined>();
    
    const [passwordOk, setPasswordOk] = useState<"untouched" | "ok" | "error">("untouched");
    const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | undefined>();
    
    const [confirmPasswordOk, setConfirmPasswordOk] = useState<"untouched" | "ok" | "error">("untouched");
    const [confirmPasswordErrorMsg, setConfirmPasswordErrorMsg] = useState<string | undefined>();
    

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

    function validateName(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event?.target?.value;

        const emailValidationSchema = registerSchema.shape.name; // TODO: continuar aqui
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

    function validateEmail(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event?.target?.value;

        const emailValidationSchema = registerSchema.shape.email;
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

        console.log({ value })
    }

    function validateConfirmPassword(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event?.target?.value;

        console.log({ value })
    }

    return (
        <div className="w-full max-w-sm rounded-xl bg-white/10 p-8 text-white shadow-xl space-y-6">
            <h1 className="text-center text-3xl font-bold font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#e0e1d7] to-[#dff8a7]">T3asks</h1>

            <h3 className="text-center text-2xl font-light">
                Crie a sua conta
            </h3>

            {/* CADASTRO */}
            <form action={register} className="space-y-4">
                <FieldGroup>
                    <SimpleInput
                        onChange={validateName}
                        name="name"
                        type="text"
                        placeholder="Informe o seu nome"
                        title="Nome"
                        errorMsg={nameErrorMsg}
                        required
                    />

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

                    <SimpleInput
                        onChange={validateConfirmPassword}
                        name="confirm-password"
                        type="password"
                        placeholder="Confirme a Senha"
                        title="Confirme a senha"
                        errorMsg={confirmPasswordErrorMsg}
                        required
                    />
                </FieldGroup>

                {!!registerErrorMsg && <span>{registerErrorMsg}</span>}
                <button className="w-full rounded-md bg-blue-600 py-2 font-semibold hover:bg-blue-700">
                    Criar conta
                </button>
            </form>

            <hr className="border-white/20" />

            <p>
                Já possui uma conta?
                <a
                    href="/auth/login"
                    className="ml-[5px] underline"
                >
                    Faça login aqui.
                </a>
            </p>
        </div>
    );
}
