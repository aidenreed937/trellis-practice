import {
  createTodoRequestSchema,
  listTodosResponseSchema,
  todoSchema,
  type CreateTodoRequest,
  type ListTodosResponse,
  type TodoDto,
} from '@trellis-practice/shared';

import { apiRequest } from './client';

export async function fetchTodos(): Promise<ListTodosResponse> {
  const data = await apiRequest<unknown>('/api/todos');
  return listTodosResponseSchema.parse(data);
}

export async function createTodo(input: CreateTodoRequest): Promise<TodoDto> {
  const request = createTodoRequestSchema.parse(input);
  const data = await apiRequest<unknown>('/api/todos', {
    method: 'POST',
    body: request,
  });

  return todoSchema.parse(data);
}

export async function toggleTodo(id: string): Promise<TodoDto> {
  const data = await apiRequest<unknown>(`/api/todos/${id}/toggle`, {
    method: 'PATCH',
  });

  return todoSchema.parse(data);
}
