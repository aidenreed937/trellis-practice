import type { Kysely } from 'kysely';

import type { DatabaseSchema, TodoTable } from '../../db/client';

export type TodoRecord = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

function toTodoRecord(row: TodoTable): TodoRecord {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed === 1,
    createdAt: row.created_at,
  };
}

export async function selectTodos(db: Kysely<DatabaseSchema>): Promise<TodoRecord[]> {
  const rows = await db.selectFrom('todos').selectAll().orderBy('created_at', 'desc').execute();

  return rows.map(toTodoRecord);
}

export async function selectTodoById(db: Kysely<DatabaseSchema>, id: string): Promise<TodoRecord | null> {
  const row = await db.selectFrom('todos').selectAll().where('id', '=', id).executeTakeFirst();

  return row ? toTodoRecord(row) : null;
}

export async function insertTodo(
  db: Kysely<DatabaseSchema>,
  input: { id: string; title: string; createdAt: string },
): Promise<TodoRecord> {
  await db
    .insertInto('todos')
    .values({
      id: input.id,
      title: input.title,
      completed: 0,
      created_at: input.createdAt,
    })
    .execute();

  const todo = await selectTodoById(db, input.id);

  if (!todo) {
    throw new Error('Inserted todo could not be loaded');
  }

  return todo;
}

export async function updateTodoCompleted(
  db: Kysely<DatabaseSchema>,
  input: { id: string; completed: boolean },
): Promise<TodoRecord | null> {
  await db
    .updateTable('todos')
    .set({ completed: input.completed ? 1 : 0 })
    .where('id', '=', input.id)
    .execute();

  return selectTodoById(db, input.id);
}
