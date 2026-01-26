import { z } from "zod";

const passwordSchema = z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
    .max(30, { message: "Senha deve ter no máximo 30 caracteres" })
    .refine((password) => /[A-Z]/.test(password), {
        message: "A senha deve possuir ao menus um caractere maiúsculo",
    })
    .refine((password) => /[a-z]/.test(password), {
        message: "A senha deve possuir ao menus um caractere minúsculo",
    })
    .refine((password) => /[0-9]/.test(password), { message: "A senha deve possuir ao menus um número" })
    .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "A senha deve possuir ao menus um caractere especial",
    });


export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: passwordSchema,
});

export const registerSchema = z.object({
    name: z.string().min(2, "Nome muito curto"),
    email: z.string().email("Email inválido"),
    password: passwordSchema,
});

export const confirmPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "As senhas não coincidem",
            path: ['confirmPassword'],
        });
    }
});
