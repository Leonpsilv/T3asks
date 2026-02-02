"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerAction } from "./actions";
import { registerSchema, type RegisterInputType } from "~/schemas/register.schema";

import { SimpleInput } from "~/app/_components/SimpleInput";
import { SubmitButton } from "~/app/_components/SubmitButton";
import { FieldError, FieldGroup } from "~/components/ui/field";
import { useRouter } from "next/navigation";
import { useAppToast } from "~/app/_contexts/toastContext";

export default function RegisterForm() {
    const toast = useAppToast();
    const router = useRouter();

    const [registerErrorMsg, setRegisterErrorMsg] = useState<string | undefined>();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<RegisterInputType>({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(data: RegisterInputType) {
        try {
            setRegisterErrorMsg(undefined);

            await registerAction(data);

            toast.success("Cadastro realizado com sucesso!");
            router.replace("/auth/login")
        } catch (error) {
            toast.error(error);
            setRegisterErrorMsg(
                error instanceof Error
                    ? error.message
                    : "Erro inesperado. Tente novamente em alguns minutos."
            );
        }
    }

    return (
        <div className="w-full max-w-sm rounded-xl bg-white/10 p-8 text-white shadow-xl space-y-6">
            <h1 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e0e1d7] to-[#dff8a7]">
                T3asks
            </h1>

            <h3 className="text-center text-2xl font-light">
                Crie a sua conta
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup>
                    <SimpleInput
                        register={register}
                        name="name"
                        type="text"
                        title="Nome"
                        placeholder="Informe o seu nome"
                        errorMsg={errors.name?.message}
                        required
                    />

                    <SimpleInput
                        register={register}
                        name="email"
                        type="email"
                        title="E-mail"
                        placeholder="Informe o seu e-mail"
                        errorMsg={errors.email?.message}
                        required
                    />

                    <SimpleInput
                        register={register}
                        name="password"
                        type="password"
                        title="Senha"
                        placeholder="Digite uma senha"
                        errorMsg={errors.password?.message}
                        required
                    />

                    <SimpleInput
                        register={register}
                        name="confirmPassword"
                        type="password"
                        title="Confirme a senha"
                        placeholder="Confirme a Senha"
                        errorMsg={errors.confirmPassword?.message}
                        required
                    />
                </FieldGroup>

                <SubmitButton
                    label="Criar conta"
                    isPending={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-green-400/50 py-2 font-semibold
            hover:bg-green-700/50 disabled:cursor-default disabled:bg-green-400/20 cursor-pointer"
                />

                {!!registerErrorMsg && <FieldError>{registerErrorMsg}</FieldError>}
            </form>

            <hr className="border-white/20" />

            <p>
                Já possui uma conta?
                <a href="/auth/login" className="ml-[5px] underline">
                    Faça login aqui.
                </a>
            </p>
        </div>
    );
}
