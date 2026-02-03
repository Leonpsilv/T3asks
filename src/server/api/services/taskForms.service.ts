
import { and, eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { type TaskFormInputType, type UpdateTaskInput } from "~/schemas/task.schema";
import { tasks } from "~/server/db/schema";
import { calculateTaskDates } from "./taskDates.service";
import { TRPCError } from "@trpc/server";

export async function createTask(
    db: PostgresJsDatabase<any>,
    userId: string,
    input: TaskFormInputType
) {
    const { startedAt, resolvedAt } = calculateTaskDates(input.status);

    await db.insert(tasks).values({
        id: crypto.randomUUID(),
        userId,
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        category: input.category,
        deadline: input.deadline,
        startedAt,
        resolvedAt,
    });
}

export async function updateTask(
    db: PostgresJsDatabase<any>,
    userId: string,
    input: UpdateTaskInput
) {
    const oldTask = await db
        .select()
        .from(tasks)
        .where(
            and(
                eq(tasks.id, input.id),
                eq(tasks.userId, userId)
            )
        )
        .then(r => r[0]);

    if (!oldTask) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Task not found",
        });
    }

    const { startedAt, resolvedAt } = calculateTaskDates(
        input.status,
        oldTask
    );

    await db
        .update(tasks)
        .set({
            title: input.title,
            description: input.description,
            status: input.status,
            priority: input.priority,
            category: input.category,
            deadline: input.deadline,
            startedAt,
            resolvedAt,
        })
        .where(eq(tasks.id, input.id));
}


export async function deleteTask(
    db: PostgresJsDatabase<any>,
    userId: string,
    taskId: string
) {
    const task = await db
        .select()
        .from(tasks)
        .where(
            and(
                eq(tasks.id, taskId),
                eq(tasks.userId, userId)
            )
        )
        .then(r => r[0]);

    if (!task) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Task not found",
        });
    }

    await db
        .update(tasks)
        .set({ deletedAt: new Date() })
        .where(
            and(
                eq(tasks.id, taskId),
                eq(tasks.userId, userId)
            )
        );
}