import type { TodoDto } from '@trellis-practice/shared';

type TodoListProps = {
  todos: TodoDto[];
  onToggleTodo: (id: string) => Promise<void>;
};

export function TodoList({ todos, onToggleTodo }: TodoListProps) {
  if (todos.length === 0) {
    return <p>No todos yet.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li key={todo.id}>
          <button
            className="todo-button"
            data-completed={todo.completed}
            type="button"
            onClick={() => void onToggleTodo(todo.id)}
          >
            {todo.title}
          </button>
        </li>
      ))}
    </ul>
  );
}
