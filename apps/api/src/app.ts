import cors from '@fastify/cors';
import fastify from 'fastify';
import type { Kysely } from 'kysely';

import type { DatabaseSchema } from './db/client';
import { AppError, toErrorResponse } from './shared/errors';
import { registerTodoRoutes } from './features/todos/todos.routes';

export type AppOptions = {
  db: Kysely<DatabaseSchema>;
};

export async function createApp(options: AppOptions) {
  const app = fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  app.get('/api/health', () => ({ ok: true }));
  await registerTodoRoutes(app, { db: options.db });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.status).send(toErrorResponse(error));
    }

    app.log.error({ error }, 'Unhandled API error');
    return reply.code(500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  });

  return app;
}
