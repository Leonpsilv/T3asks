"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { loginAction } from "./actions";
import { loginSchema, type LoginInputType } from "~/schemas/login.schema";

import { FieldError, FieldGroup } from "~/components/ui/field";
import { SimpleInput } from "~/app/_components/SimpleInput";
import { SubmitButton } from "~/app/_components/SubmitButton";
import { useAppToast } from "~/app/_contexts/toastContext";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const toast = useAppToast();
    const router = useRouter();
    const [loginErrorMsg, setLoginErrorMsg] = useState<string | undefined>();

    const form = useForm<LoginInputType>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginInputType) {
        try {
            setLoginErrorMsg(undefined);

            const result = await loginAction({
                email: data.email,
                password: data.password,
            });

            if (!result.success) {
                toast.error(result.message);
                setLoginErrorMsg(result.message);
                return;
            }

            toast.success("Login realizado com sucesso!");

            router.replace("/")
        } catch (e) {
            console.error({ e })
            const error = "Erro inesperado. Tente novamente em alguns minutos."
            toast.error(error);
            setLoginErrorMsg(error);
        }
    }

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        void form.handleSubmit(onSubmit)(e);
    };

    return (
        <div className="w-full max-w-sm rounded-xl bg-white/10 p-8 text-white shadow-xl space-y-6">
            <h1 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e0e1d7] to-[#dff8a7]">
                T3asks
            </h1>

            <h3 className="text-center text-2xl font-light">
                Faça o seu login
            </h3>

            <form
                onSubmit={handleFormSubmit}
                className="space-y-4"
            >
                <FieldGroup>
                    <SimpleInput
                        name="email"
                        type="email"
                        placeholder="Informe o seu e-mail"
                        title="E-mail"
                        register={form.register}
                        errorMsg={form.formState.errors.email?.message}
                        required
                    />

                    <SimpleInput
                        name="password"
                        type="password"
                        placeholder="Informe a sua senha"
                        title="Senha"
                        register={form.register}
                        errorMsg={form.formState.errors.password?.message}
                        required
                    />
                </FieldGroup>

                <SubmitButton
                    label="Entrar"
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-green-400/50 py-2 font-semibold
            hover:bg-green-700/50 disabled:cursor-default disabled:bg-green-400/20 cursor-pointer"
                    isPending={form.formState.isSubmitting}
                />

                {!!loginErrorMsg && (
                    <FieldError>{loginErrorMsg}</FieldError>
                )}
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
