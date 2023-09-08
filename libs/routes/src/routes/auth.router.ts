import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { TRPCError } from '@trpc/server';
import { SECRET_TOKEN, AuthUser } from '../context';

const DEFAULT_AUTH = {
  login: 'test',
  password: '12345'
};

export const authRouter = router({
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.user as AuthUser | null;
  }),

  login: publicProcedure
    .input(
      z.object({
        login: z.string(),
        password: z.string()
      })
    )
    .mutation(async (opts) => {
      const { ctx, input } = opts;
      if (ctx.user) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      if (
        input.login === DEFAULT_AUTH.login &&
        input.password === DEFAULT_AUTH.password
      ) {
        return SECRET_TOKEN;
      }

      throw new TRPCError({ code: 'BAD_REQUEST' });
    })
});
