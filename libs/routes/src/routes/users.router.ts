import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';
import { db } from '../db';
import { usersTable } from '../schema';
import { eq, ilike, or, sql } from 'drizzle-orm';

export const usersRouter = router({
  userList: protectedProcedure
    .input(
      z.object({
        offset: z.optional(z.number()),
        limit: z.optional(z.number()),
        search: z.optional(z.string())
      })
    )
    .query(async ({ input }) => {
      let countRequest = db
        .select({ count: sql<number>`count(*)` })
        .from(usersTable);
      let usersRequest = db
        .select()
        .from(usersTable)
        .offset(input.offset ?? 0)
        .limit(input.limit ?? 15);

      if (input.search) {
        const where = or(
          ilike(usersTable.name, `%${input.search}%`),
          ilike(usersTable.company, `%${input.search}%`)
        );
        countRequest = countRequest.where(where);
        usersRequest = usersRequest.where(where);
      }

      const [count, users] = await Promise.all([countRequest, usersRequest]);

      return { count: count[0].count, users };
    }),
  userCreate: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(256),
        age: z.number().min(18),
        gender: z.enum(['male', 'female']),
        company: z.string().min(2).max(256)
      })
    )
    .mutation(async ({ input }) => {
      await db.insert(usersTable).values({
        ...input,
        isActive: true
      });
    }),
  userDelete: protectedProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.delete(usersTable).where(eq(usersTable.id, input));
    })
});

export type UsersRouter = typeof usersRouter;
