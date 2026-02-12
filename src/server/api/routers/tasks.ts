import { z } from "zod";

import { and, asc, between, desc, eq, gt, ilike, isNotNull, isNull, lt, sql } from "drizzle-orm";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { listTaskSchema, taskFormSchema, updateTaskSchema } from "~/schemas/task.schema";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";
import { createTask, deleteTask, updateTask } from "../services/taskForms.service";

export const tasksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskFormSchema)
    .mutation(async ({ ctx, input }) => {
      await createTask(ctx.db, ctx.session.user.id, input);
    }),

  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      await updateTask(ctx.db, ctx.session.user.id, input);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await deleteTask(ctx.db, ctx.session.user.id, input.id);
    }),

  list: protectedProcedure
    .input(listTaskSchema)
    .query(async ({ ctx, input }) => {
      const conditions = [
        eq(tasks.userId, ctx.session.user.id),
        isNull(tasks.deletedAt),
        between(tasks.createdAt, input.createdAtStart, input.createdAtEnd),
      ];

      if (input.status) {
        conditions.push(eq(tasks.status, input.status));
      }

      if (input.search) {
        conditions.push(ilike(tasks.title, `%${input.search}%`));
      }

      const orderByColumnMap = {
        code: tasks.code,
        title: tasks.title,
        status: tasks.status,
        priority: tasks.priority,
        category: tasks.category,
        createdAt: tasks.createdAt,
        startedAt: tasks.startedAt,
        resolvedAt: tasks.resolvedAt,
        deadline: tasks.deadline,
      } as const;

      const orderColumn = orderByColumnMap[input.sortBy] ?? tasks.createdAt;
      const orderFn = input.sortOrder === "asc" ? asc : desc;

      const offset = (input.page - 1) * input.pageSize;

      const totalItemsPromise = ctx.db
        .select({ count: sql`count(*)` })
        .from(tasks)
        .where(and(...conditions))
        .then((r) => Number(r[0]?.count ?? 0));

      const itemsPromise = ctx.db
        .select()
        .from(tasks)
        .where(and(...conditions))
        .orderBy(orderFn(orderColumn))
        .limit(input.pageSize)
        .offset(offset);

      const [totalItems, items] = await Promise.all([
        totalItemsPromise,
        itemsPromise,
      ]);

      return {
        items,
        totalItems,
        totalPages: Math.ceil(totalItems / input.pageSize),
        page: input.page,
        pageSize: input.pageSize,
      };
    }),

  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    const userCondition = and(
      eq(tasks.userId, ctx.session.user.id),
      isNull(tasks.deletedAt)
    );

    const inProgressPromise = ctx.db
      .select()
      .from(tasks)
      .where(
        and(
          userCondition,
          eq(tasks.status, TasksStatusConfig.IN_PROGRESS.value)
        )
      )
      .orderBy(desc(tasks.createdAt))
      .limit(5);

    const completedPromise = ctx.db
      .select()
      .from(tasks)
      .where(
        and(
          userCondition,
          eq(tasks.status, TasksStatusConfig.DONE.value)
        )
      )
      .orderBy(desc(tasks.resolvedAt))
      .limit(5);

    const delayedPromise = ctx.db
      .select()
      .from(tasks)
      .where(
        and(
          userCondition,
          isNull(tasks.resolvedAt),
          isNotNull(tasks.deadline),
          lt(tasks.deadline, today)
        )
      )
      .orderBy(desc(tasks.deadline))
      .limit(5);

    const createdLast30DaysPromise = ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(
        and(
          userCondition,
          gt(tasks.createdAt, last30Days)
        )
      );

    const completedLast30DaysPromise = ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(
        and(
          userCondition,
          eq(tasks.status, TasksStatusConfig.DONE.value),
          isNotNull(tasks.resolvedAt),
          gt(tasks.createdAt, last30Days)
        )
      );

    const delayedNotCompletedPromise = ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(
        and(
          userCondition,
          isNull(tasks.resolvedAt),
          isNotNull(tasks.deadline),
          lt(tasks.deadline, today)
        )
      );

    const holdingNotCompletedPromise = ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .where(
        and(
          userCondition,
          isNull(tasks.resolvedAt),
          eq(tasks.status, TasksStatusConfig.HOLDING.value)
        )
      );

    const [
      inProgress,
      completed,
      delayed,
      createdLast30Days,
      completedLast30Days,
      delayedNotCompleted,
      holdingNotCompleted
    ] = await Promise.all([
      inProgressPromise,
      completedPromise,
      delayedPromise,
      createdLast30DaysPromise,
      completedLast30DaysPromise,
      delayedNotCompletedPromise,
      holdingNotCompletedPromise
    ]);

    return {
      inProgress,
      completed,
      delayed,
      metrics: {
        createdLast30Days: Number(createdLast30Days[0]?.count ?? 0),
        completedLast30Days: Number(completedLast30Days[0]?.count ?? 0),
        delayedNotCompleted: Number(delayedNotCompleted[0]?.count ?? 0),
        holdingNotCompleted: Number(holdingNotCompleted[0]?.count ?? 0),
      },
    };
  }),

  board: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const items = await ctx.db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.userId, userId),
            isNull(tasks.deletedAt)
          )
        )
        .orderBy(desc(tasks.createdAt));

      return items;
    }),

  boardWithFilters: protectedProcedure
    .input(z.object({
      createdAtStart: z.date(),
      createdAtEnd: z.date(),
      search: z.string().optional(),
      status: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const conditions = [
        eq(tasks.userId, ctx.session.user.id),
        isNull(tasks.deletedAt),
        between(tasks.createdAt, input.createdAtStart, input.createdAtEnd),
      ];

      if (input.status && input.status !== "clear") {
        conditions.push(eq(tasks.status, input.status));
      }

      if (input.search && input.search.trim().length > 0) {
        conditions.push(ilike(tasks.title, `%${input.search}%`));
      }

      const items = await ctx.db
        .select()
        .from(tasks)
        .where(and(...conditions))
        .orderBy(desc(tasks.createdAt));

      return items;
    }),
});
