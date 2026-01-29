import { z } from "zod";

const passwordSchema = z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(30, "Senha deve ter no máximo 30 caracteres")
    .regex(/[A-Z]/, "A senha deve possuir ao menos um caractere maiúsculo")
    .regex(/[a-z]/, "A senha deve possuir ao menos um caractere minúsculo")
    .regex(/[0-9]/, "A senha deve possuir ao menos um número")
    .regex(/[!@#$%^&*]/, "A senha deve possuir ao menos um caractere especial");

export const registerSchema = z
    .object({
        name: z.string().min(2, "Nome muito curto"),
        email: z.string().email("Email inválido"),
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "As senhas não coincidem",
    });

export type RegisterInputType = z.infer<typeof registerSchema>;
