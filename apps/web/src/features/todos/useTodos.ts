import type { TodoDto } from '@trellis-practice/shared';
import { useCallback, useEffect, useState } from 'react';

import * as todoApi from '../../api/todos';

type TodosState =
  | { status: 'loading'; items: TodoDto[]; errorMessage: null }
  | { status: 'loaded'; items: TodoDto[]; errorMessage: null }
  | { status: 'error'; items: TodoDto[]; errorMessage: string };

type UseTodosResult = TodosState & {
  createTodo: (input: { title: string }) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong';
}

export function useTodos(): UseTodosResult {
  const [state, setState] = useState<TodosState>({
    status: 'loading',
    items: [],
    errorMessage: null,
  });

  const loadTodos = useCallback(async () => {
    try {
      const response = await todoApi.fetchTodos();
      setState({ status: 'loaded', items: response.todos, errorMessage: null });
    } catch (error) {
      setState((current) => ({
        status: 'error',
        items: current.items,
        errorMessage: getErrorMessage(error),
      }));
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  const createTodo = useCallback(async (input: { title: string }) => {
    const created = await todoApi.createTodo(input);
    setState((current) => ({
      status: 'loaded',
      items: [created, ...current.items],
      errorMessage: null,
    }));
  }, []);

  const toggleTodo = useCallback(async (id: string) => {
    const updated = await todoApi.toggleTodo(id);
    setState((current) => ({
      status: 'loaded',
      items: current.items.map((todo) => (todo.id === id ? updated : todo)),
      errorMessage: null,
    }));
  }, []);

  return {
    ...state,
    createTodo,
    toggleTodo,
  };
}
