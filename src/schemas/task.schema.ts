import { z } from "zod";
import { TasksCategoryConfig } from "~/constants/tasksCategory";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksStatusConfig } from "~/constants/tasksStatus";

const statusValues = Object.values(TasksStatusConfig).map(s => s.value);
const priorityValues = Object.values(TasksPriorityConfig).map(p => p.value);
const categoryValues = Object.values(TasksCategoryConfig).map(c => c.value);

export const taskFormSchema = z.object({
    title: z.string().min(3, "Título deve ter ao menos três caracteres"),
    description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
    status: z.enum(statusValues as [string, ...string[]]).optional(),
    priority: z.enum(priorityValues as [string, ...string[]]).optional(),
    category: z.enum(categoryValues as [string, ...string[]]).optional(),
    deadline: z.date().optional(),
});

export const updateTaskSchema = taskFormSchema.extend({
    id: z.string().uuid(),
});

export const listTaskSchema = z.object({
    status: z.string().optional(),
    search: z.string().optional(),
    deadline: z.date().optional(),
    createdAtStart: z.date(),
    createdAtEnd: z.date(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(5),

    sortBy: z
        .enum([
            "code",
            "title",
            "status",
            "priority",
            "category",
            "createdAt",
            "startedAt",
            "resolvedAt",
            "deadline",
        ])
        .default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export type TaskFormInputType = z.infer<typeof taskFormSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
