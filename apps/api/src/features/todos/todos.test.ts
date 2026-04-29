import { describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { createApp } from '../../app';
import { createDb } from '../../db/client';
import { runMigrations } from '../../db/migrate';

async function createTestApp() {
  const tempDir = mkdtempSync(join(tmpdir(), 'trellis-api-test-'));
  const databaseUrl = `file:${join(tempDir, 'test.db')}`;
  runMigrations(databaseUrl);
  const db = createDb(databaseUrl);
  const app = await createApp({ db });

  async function cleanup() {
    await app.close();
    await db.destroy();
    rmSync(tempDir, { recursive: true, force: true });
  }

  return { app, cleanup };
}

describe('todo API', () => {
  it('rejects blank todo titles', async () => {
    const { app, cleanup } = await createTestApp();

    const response = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: { title: '   ' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: { code: 'BAD_REQUEST' },
    });

    await cleanup();
  });

  it('creates todos and includes them in the list response', async () => {
    const { app, cleanup } = await createTestApp();

    const createResponse = await app.inject({
      method: 'POST',
      url: '/api/todos',
      payload: { title: 'Build scaffold' },
    });

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.json()).toMatchObject({ title: 'Build scaffold', completed: false });

    const listResponse = await app.inject({ method: 'GET', url: '/api/todos' });

    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.json()).toMatchObject({
      todos: [expect.objectContaining({ title: 'Build scaffold' })],
    });

    await cleanup();
  });

  it('returns not found for missing todo toggles', async () => {
    const { app, cleanup } = await createTestApp();

    const response = await app.inject({
      method: 'PATCH',
      url: '/api/todos/8e4a9314-27e0-42d4-b1b5-d10ec6b43863/toggle',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      error: { code: 'NOT_FOUND' },
    });

    await cleanup();
  });
});
