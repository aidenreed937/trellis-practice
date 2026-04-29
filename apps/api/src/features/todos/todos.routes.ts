import type { FastifyInstance } from 'fastify';

import type { DatabaseSchema } from '../../db/client';
import type { Kysely } from 'kysely';
import { createTodo, listTodos, toggleTodo } from './todos.service';

type TodoRouteOptions = {
  db: Kysely<DatabaseSchema>;
};

export function registerTodoRoutes(app: FastifyInstance, options: TodoRouteOptions): Promise<void> {
  app.get('/api/todos', async () => {
    const todos = await listTodos(options.db);
    return { todos };
  });

  app.post('/api/todos', async (request, reply) => {
    const todo = await createTodo(options.db, request.body as { title: string });
    return reply.code(201).send(todo);
  });

  app.patch('/api/todos/:id/toggle', async (request) => {
    const params = request.params as { id: string };
    return toggleTodo(options.db, params.id);
  });
  return Promise.resolve();
}
