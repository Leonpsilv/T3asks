import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { eq, and, ilike, isNull, between, desc } from "drizzle-orm";
import { tasks } from "~/server/db/schema";

export const tasksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        status: z.string().max(24).optional(),
        priority: z.string().max(24).optional(),
        category: z.string().max(48).optional(),
        resolvedAt: z.date().optional(),
        deadline: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values({
        id: crypto.randomUUID(),
        title: input.title,
        userId: ctx.session.user.id,
        ...({ description: input.description }),
        ...({ status: input.status }),
        ...({ priorirty: input.priority }),
        ...({ category: input.category }),
        ...({ resolvedAt: input.resolvedAt }),
        ...({ deadline: input.deadline }),
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        status: z.string(),
        priority: z.string().max(24).optional(),
        category: z.string().max(48).optional(),
        resolvedAt: z.date().optional(),
        deadline: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set({
          title: input.title,
          ...({ description: input.description }),
          ...({ status: input.status }),
          ...({ priorirty: input.priority }),
          ...({ category: input.category }),
          ...({ resolvedAt: input.resolvedAt }),
          ...({ deadline: input.deadline }),
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
      })
    )
    .query(async ({ ctx, input }) => {
      const conditions = [
        eq(tasks.userId, ctx.session.user.id),
        isNull(tasks.deletedAt),
        between(tasks.createdAt, input.createdAtStart, input.createdAtEnd)
      ];

      if (input.status) {
        conditions.push(eq(tasks.status, input.status));
      }

      if (input.search) {
        conditions.push(ilike(tasks.title, `%${input.search}%`));
      }

      return ctx.db
        .select()
        .from(tasks)
        .where(and(...conditions))
        .orderBy(desc(tasks.createdAt));
    }),
});
