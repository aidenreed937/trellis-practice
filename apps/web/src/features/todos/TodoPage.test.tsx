import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderApp } from '../../test/render';
import { TodoPage } from './TodoPage';

const fetchMock = vi.fn<typeof fetch>();

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('TodoPage', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('renders loading state and loaded todos', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        todos: [
          {
            id: '8e4a9314-27e0-42d4-b1b5-d10ec6b43863',
            title: 'Build scaffold',
            completed: false,
            createdAt: '2026-04-29T00:00:00.000Z',
          },
        ],
      }),
    );

    renderApp(<TodoPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Build scaffold' })).toBeInTheDocument();
  });

  it('does not submit blank todo titles', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValueOnce(jsonResponse({ todos: [] }));

    renderApp(<TodoPage />);

    await screen.findByText('No todos yet.');
    expect(screen.getByLabelText('Title')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });
});
