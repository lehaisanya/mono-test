import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createContext, appRouter } from '@mono-test/routes';
import { connectToDb } from '@mono-test/db';

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(express.json());

// app.use(express.static('../../../dist/apps/client'));
app.use(express.static('../../esbuild'))

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
    createContext
  })
);

const server = app.listen(PORT, () => {
  console.log(`Server start on http://localhost:${PORT}`);
  connectToDb();
});

server.on('error', console.error);
