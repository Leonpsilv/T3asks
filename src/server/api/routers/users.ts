import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { user, tasks } from "~/server/db/schema";
import {
  eq,
  and,
  isNull,
  ilike,
  desc,
  sql,
} from "drizzle-orm";
import { TasksStatusConfig } from "~/constants/tasksStatus";

export const usersRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().min(1).default(1),
        pageSize: z.number().min(1).max(100).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayISO = today.toISOString();

      const conditions = [];

      if (input.search) {
        conditions.push(ilike(user.name, `%${input.search}%`));
      }

      /** 🔹 total de usuários (sem join para não duplicar) */
      const totalItemsPromise = ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(user)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((r) => Number(r[0]?.count ?? 0));

      const offset = (input.page - 1) * input.pageSize;

      /** 🔹 usuários paginados com métricas */
      const itemsPromise = ctx.db
        .select({
          userId: user.id,
          name: user.name,
          email: user.email,

          totalTasks: sql<number>`count(${tasks.id})`,

          completedTasks: sql<number>`
            count(${tasks.id}) filter (
              where ${tasks.status} = ${TasksStatusConfig.DONE.value}
            )
          `,

          delayedTasks: sql<number>`
            count(${tasks.id}) filter (
              where
                ${tasks.deadline} is not null
                and ${tasks.deadline} < ${todayISO}
            )
          `,

          inProgressTasks: sql<number>`
            count(${tasks.id}) filter (
              where ${tasks.status} = ${TasksStatusConfig.IN_PROGRESS.value}
            )
          `,
        })
        .from(user)
        .leftJoin(
          tasks,
          and(
            eq(tasks.userId, user.id),
            isNull(tasks.deletedAt)
          )
        )
        .where(conditions.length ? and(...conditions) : undefined)
        .groupBy(user.id)
        .orderBy(desc(user.name))
        .limit(input.pageSize)
        .offset(offset);

      const [totalItems, rows] = await Promise.all([
        totalItemsPromise,
        itemsPromise,
      ]);

      const items = rows.map((row) => {
        const total = Number(row.totalTasks ?? 0);
        const completed = Number(row.completedTasks ?? 0);
        const delayed = Number(row.delayedTasks ?? 0);

        return {
          userId: row.userId,
          name: row.name,
          email: row.email,

          totalTasks: total,
          inProgress: Number(row.inProgressTasks ?? 0),

          completedRate: total > 0
            ? Math.round((completed / total) * 100)
            : 0,

          delayedRate: total > 0
            ? Math.round((delayed / total) * 100)
            : 0,
        };
      });

      return {
        items,
        totalItems,
        totalPages: Math.ceil(totalItems / input.pageSize),
        page: input.page,
        pageSize: input.pageSize,
      };
    }),
});
