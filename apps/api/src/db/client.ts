import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { dirname } from 'node:path';
import { mkdirSync } from 'node:fs';

export type TodoTable = {
  id: string;
  title: string;
  completed: number;
  created_at: string;
};

export type MigrationTable = {
  name: string;
  applied_at: string;
};

export type DatabaseSchema = {
  todos: TodoTable;
  _migrations: MigrationTable;
};

function resolveSqlitePath(databaseUrl: string): string {
  if (!databaseUrl.startsWith('file:')) {
    return databaseUrl;
  }

  return databaseUrl.slice('file:'.length);
}

export function createDb(databaseUrl: string): Kysely<DatabaseSchema> {
  const databasePath = resolveSqlitePath(databaseUrl);
  mkdirSync(dirname(databasePath), { recursive: true });

  return new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({
      database: new Database(databasePath),
    }),
  });
}
