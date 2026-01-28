import { z } from "zod";
import { TasksCategoryConfig } from "~/constants/tasksCategory";
import { TasksPriorityConfig } from "~/constants/tasksPriority";
import { TasksStatusConfig } from "~/constants/tasksStatus";

const statusValues = Object.values(TasksStatusConfig).map(s => s.value);
const priorityValues = Object.values(TasksPriorityConfig).map(p => p.value);
const categoryValues = Object.values(TasksCategoryConfig).map(c => c.value);

export const createTaskSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().optional(),
    status: z.enum(statusValues as [string, ...string[]]).optional(),
    priority: z.enum(priorityValues as [string, ...string[]]).optional(),
    category: z.enum(categoryValues as [string, ...string[]]).optional(),
    // status: z.string().max(24).optional(),
    // priority: z.string().max(24).optional(),
    // category: z.string().max(48).optional(),
    resolvedAt: z.date().optional(),
    deadline: z.date().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
