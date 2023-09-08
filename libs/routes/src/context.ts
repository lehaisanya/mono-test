import { inferAsyncReturnType } from '@trpc/server';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';

export type AuthUser = {
  name: string;
};

export const SECRET_TOKEN = 'my_secret_token';

function getUser(authorization: string | undefined): AuthUser | null {
  if (authorization) {
    const token = authorization.split(' ')[1];
    if (token === SECRET_TOKEN) {
      return { name: 'Test User' };
    }
  }
  return null;
}

export async function createContext({ req }: CreateHTTPContextOptions) {
  const user = getUser(req.headers.authorization) as AuthUser | null;

  return { user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
