import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createContext, appRouter } from '@mono-test/routes';
import { connectToDb } from '@mono-test/db';
import { createHTTPServer } from '@trpc/server/adapters/standalone';

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use(
  '/api',
  createExpressMiddleware({
    router: appRouter,
    createContext,
    middleware: cors()
  })
);

app.use('/hel', (req, res) => {
  res.send('Hello');
});

// createHTTPServer({
//   router: appRouter,
//   createContext,
//   middleware: cors()
// }).listen(3000);

const server = app.listen(PORT, () => {
  console.log(`Server start on http://localhost:${PORT}`);
  connectToDb();
});

server.on('error', console.error);
