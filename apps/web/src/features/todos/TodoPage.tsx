import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';
import { useTodos } from './useTodos';

export function TodoPage() {
  const todos = useTodos();

  return (
    <main className="page">
      <section className="panel stack" aria-labelledby="todos-heading">
        <div>
          <h1 id="todos-heading">Trellis Todos</h1>
          <p>Practice a fullstack Trellis workflow with a small CRUD surface.</p>
        </div>

        <TodoForm onSubmitTodo={todos.createTodo} />

        {todos.status === 'loading' ? <p>Loading...</p> : null}
        {todos.status === 'error' ? (
          <p className="error" role="alert">
            {todos.errorMessage}
          </p>
        ) : null}

        {todos.status !== 'loading' ? <TodoList todos={todos.items} onToggleTodo={todos.toggleTodo} /> : null}
      </section>
    </main>
  );
}
