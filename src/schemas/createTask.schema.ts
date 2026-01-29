import { z } from "zod";
import { TasksCategoryConfig } from "~/constants/tasksCategory";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksStatusConfig } from "~/constants/tasksStatus";

const statusValues = Object.values(TasksStatusConfig).map(s => s.value);
const priorityValues = Object.values(TasksPriorityConfig).map(p => p.value);
const categoryValues = Object.values(TasksCategoryConfig).map(c => c.value);

export const createTaskSchema = z.object({
    title: z.string().min(3, "Título deve ter ao menos três caracteres"),
    description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
    status: z.enum(statusValues as [string, ...string[]]).optional(),
    priority: z.enum(priorityValues as [string, ...string[]]).optional(),
    category: z.enum(categoryValues as [string, ...string[]]).optional(),
    deadline: z.date().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
