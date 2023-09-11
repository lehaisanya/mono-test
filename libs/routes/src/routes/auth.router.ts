import { publicProcedure, router } from '../trpc';
import { authSchema } from '@mono-test/schemas';
import { loginHandler, meHandler } from '../controllers/auth.controller';

export const authRouter = router({
  me: publicProcedure.query(meHandler),
  login: publicProcedure.input(authSchema).mutation(loginHandler)
});
