import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { eq, and, ilike, isNull, between, desc, sql, or, isNotNull, lt, gt, asc } from "drizzle-orm";
import { tasks } from "~/server/db/schema";
import { TasksStatusConfig } from "~/constants/tasksStatus";
import { TasksCategoryConfig } from "~/constants/tasksCategory";
import { TasksPriorityConfig } from "~/constants/tasksPriority";

const statusValues = Object.values(TasksStatusConfig).map(s => s.value);
const priorityValues = Object.values(TasksPriorityConfig).map(p => p.value);
const categoryValues = Object.values(TasksCategoryConfig).map(c => c.value);

export const tasksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(statusValues as [string, ...string[]]).optional(),
        priority: z.enum(priorityValues as [string, ...string[]]).optional(),
        category: z.enum(categoryValues as [string, ...string[]]).optional(),
        resolvedAt: z.date().optional(),
        deadline: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let startedAt;

      if (input.status !== TasksStatusConfig.PENDING.value) {
        startedAt = new Date();
      }

      let resolvedAt;
      if (input.status === TasksStatusConfig.DONE.value) {
        resolvedAt = new Date();
      }

      await ctx.db.insert(tasks).values({
        id: crypto.randomUUID(),
        title: input.title,
        userId: ctx.session.user.id,
        ...({ description: input.description }),
        ...({ status: input.status }),
        ...({ priority: input.priority }),
        ...({ category: input.category }),
        ...({ resolvedAt: resolvedAt }),
        ...({ deadline: input.deadline }),
        ...({ startedAt: startedAt }),
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        status: z.enum(statusValues as [string, ...string[]]),
        priority: z.enum(priorityValues as [string, ...string[]]).optional(),
        category: z.enum(categoryValues as [string, ...string[]]).optional(),
        resolvedAt: z.date().optional(),
        deadline: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const oldTask = await ctx.db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.id, input.id),
            eq(tasks.userId, ctx.session.user.id)
          )
        )
        .then((r) => r[0]);

      if (!oldTask) {
        throw new Error("Task not found");
      }

      let startedAt;
      if (input.status !== TasksStatusConfig.PENDING.value && !oldTask.startedAt) {
        startedAt = new Date();
      }

      let resolvedAt;
      if (input.status === TasksStatusConfig.DONE.value && !oldTask.resolvedAt) {
        resolvedAt = new Date();
      }

      await ctx.db
        .update(tasks)
        .set({
          title: input.title,
          ...({ description: input.description }),
          ...({ status: input.status }),
          ...({ priority: input.priority }),
          ...({ category: input.category }),
          ...({ deadline: input.deadline }),
          ...({ startedAt }),
          ...({ resolvedAt }),
        })
        .where(
          and(
            eq(tasks.id, input.id),
            eq(tasks.userId, ctx.session.user.id)
          )
        );
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({ deletedAt: new Date() })
        .where(
          and(
            eq(tasks.id, input.id),
            eq(tasks.userId, ctx.session.user.id)
          )
        );
    }),

  list: protectedProcedure
    .input(
      z.object({
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
    )
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
  })

});
