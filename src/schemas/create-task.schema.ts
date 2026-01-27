import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    status: z.string().max(24).optional(),
    priority: z.string().max(24).optional(),
    category: z.string().max(48).optional(),
    resolvedAt: z.date().optional(),
    deadline: z.date().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
