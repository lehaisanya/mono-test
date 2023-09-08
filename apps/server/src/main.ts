import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { connectToDb, createContext, appRouter } from '@mono-test/routes';
import cors from 'cors';

const server = createHTTPServer({
  createContext,
  middleware: cors(),
  router: appRouter
});

connectToDb();
server.listen(3000);
