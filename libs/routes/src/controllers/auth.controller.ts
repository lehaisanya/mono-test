import { TRPCError } from '@trpc/server';
import { Context } from '../context';
import { AuthInput, AuthUser } from '@mono-test/schemas';
import { login } from '../services/auth.service';

export const meHandler = async ({ ctx }: { ctx: Context }) => {
  return ctx.user as AuthUser | null;
};

export const loginHandler = async ({
  input,
  ctx
}: {
  input: AuthInput;
  ctx: Context;
}) => {
  if (ctx.user) {
    throw new TRPCError({ code: 'BAD_REQUEST' });
  }

  const token = login(input);

  if (!token) {
    throw new TRPCError({ code: 'BAD_REQUEST' });
  }

  return token;
};
