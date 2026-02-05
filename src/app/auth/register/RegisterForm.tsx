"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { registerSchema, type RegisterInputType } from "~/schemas/register.schema";
import { registerAction } from "./actions";

import { useRouter } from "next/navigation";
import { SimpleInput } from "~/app/_components/SimpleInput";
import { SubmitButton } from "~/app/_components/SubmitButton";
import { useAppToast } from "~/app/_contexts/toastContext";
import { FieldError, FieldGroup } from "~/components/ui/field";

export default function RegisterForm() {
    const toast = useAppToast();
    const router = useRouter();

    const [registerErrorMsg, setRegisterErrorMsg] = useState<string | undefined>();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInputType>({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(data: RegisterInputType) {
        try {
            setRegisterErrorMsg(undefined);

            const result = await registerAction(data);

            if (!result.success) {
                toast.error(result.message);
                setRegisterErrorMsg(result.message);
                return;
            }

            toast.success("Cadastro realizado com sucesso!");
            router.replace("/auth/login")
        } catch (e) {
            console.error({ e })
            const error = "Erro inesperado. Tente novamente em alguns minutos."
            toast.error(error);
            setRegisterErrorMsg(error);
        }
    }

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
    };

    return (
        <div className="w-full max-w-sm rounded-xl bg-white/10 p-8 text-white shadow-xl space-y-6">
            <h1 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#e0e1d7] to-[#dff8a7]">
                T3asks
            </h1>

            <h3 className="text-center text-2xl font-light">
                Crie a sua conta
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
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
