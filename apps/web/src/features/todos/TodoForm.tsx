import { useState, type FormEvent } from 'react';

type TodoFormProps = {
  onSubmitTodo: (input: { title: string }) => Promise<void>;
};

export function TodoForm({ onSubmitTodo }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return;

    setIsSaving(true);
    try {
      await onSubmitTodo({ title: trimmed });
      setTitle('');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="stack" onSubmit={(event) => void handleSubmit(event)}>
      <label htmlFor="todo-title">Title</label>
      <div className="row">
        <input
          id="todo-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Review Trellis workflow"
        />
        <button type="submit" disabled={isSaving || title.trim().length === 0}>
          {isSaving ? 'Saving' : 'Add'}
        </button>
      </div>
    </form>
  );
}
