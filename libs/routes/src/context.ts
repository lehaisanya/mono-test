import { inferAsyncReturnType } from '@trpc/server';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { AuthUser } from '@mono-test/schemas';
import { getAuthUser } from './services/auth.service';

async function getUser(
  authorization: string | undefined
): Promise<AuthUser | null> {
  if (authorization) {
    const token = authorization.split(' ')[1];
    if (token) {
      return await getAuthUser(token);
    }
  }
  return null;
}

export async function createContext({ req }: CreateHTTPContextOptions) {
  const user = await getUser(req.headers.authorization);

  return { user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
