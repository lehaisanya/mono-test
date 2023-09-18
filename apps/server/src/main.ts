import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { createContext, appRouter } from '@mono-test/routes';
import { connectToDb } from '@mono-test/db';
import cors from 'cors';

const server = createHTTPServer({
  createContext,
  middleware: cors(),
  router: appRouter
});

connectToDb();
server.listen(3000);
