import { describe, expect, it } from 'vitest';

import { createTodoRequestSchema, listTodosResponseSchema } from './todos';

describe('todo contracts', () => {
  it('rejects blank todo titles', () => {
    const result = createTodoRequestSchema.safeParse({ title: '   ' });

    expect(result.success).toBe(false);
  });

  it('accepts valid todo list responses', () => {
    const result = listTodosResponseSchema.safeParse({
      todos: [
        {
          id: '8e4a9314-27e0-42d4-b1b5-d10ec6b43863',
          title: 'Review Trellis workflow',
          completed: false,
          createdAt: '2026-04-29T00:00:00.000Z',
        },
      ],
    });

    expect(result.success).toBe(true);
  });
});
