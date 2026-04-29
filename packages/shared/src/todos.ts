import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  completed: z.boolean(),
  createdAt: z.string(),
});

export const listTodosResponseSchema = z.object({
  todos: z.array(todoSchema),
});

export const createTodoRequestSchema = z.object({
  title: z.string().trim().min(1).max(120),
});

export type TodoDto = z.infer<typeof todoSchema>;
export type ListTodosResponse = z.infer<typeof listTodosResponseSchema>;
export type CreateTodoRequest = z.infer<typeof createTodoRequestSchema>;
