import { createTodoRequestSchema, type CreateTodoRequest, type TodoDto } from '@trellis-practice/shared';
import type { Kysely } from 'kysely';
import { randomUUID } from 'node:crypto';

import type { DatabaseSchema } from '../../db/client';
import { BadRequestError, NotFoundError } from '../../shared/errors';
import { insertTodo, selectTodoById, selectTodos, updateTodoCompleted, type TodoRecord } from './todos.repo';

function toTodoDto(record: TodoRecord): TodoDto {
  return {
    id: record.id,
    title: record.title,
    completed: record.completed,
    createdAt: record.createdAt,
  };
}

export async function listTodos(db: Kysely<DatabaseSchema>): Promise<TodoDto[]> {
  const records = await selectTodos(db);

  return records.map(toTodoDto);
}

export async function createTodo(db: Kysely<DatabaseSchema>, input: CreateTodoRequest): Promise<TodoDto> {
  const parsed = createTodoRequestSchema.safeParse(input);

  if (!parsed.success) {
    throw new BadRequestError('Invalid todo title');
  }

  const record = await insertTodo(db, {
    id: randomUUID(),
    title: parsed.data.title,
    createdAt: new Date().toISOString(),
  });

  return toTodoDto(record);
}

export async function toggleTodo(db: Kysely<DatabaseSchema>, id: string): Promise<TodoDto> {
  const existing = await selectTodoById(db, id);

  if (!existing) {
    throw new NotFoundError('Todo not found');
  }

  const updated = await updateTodoCompleted(db, {
    id,
    completed: !existing.completed,
  });

  if (!updated) {
    throw new NotFoundError('Todo not found');
  }

  return toTodoDto(updated);
}
