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

export type LoginInputType = z.infer<typeof loginSchema>;
