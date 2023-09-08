import { router } from '../trpc';
import { authRouter } from './auth.router';
import { usersRouter } from './users.router';

export const appRouter = router({
  auth: authRouter,
  users: usersRouter
});

export type AppRouter = typeof appRouter;
