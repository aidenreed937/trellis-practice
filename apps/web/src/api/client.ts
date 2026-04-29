import { apiErrorResponseSchema, type ApiErrorCode } from '@trellis-practice/shared';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: ApiErrorCode,
  ) {
    super(message);
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const init: RequestInit = {
    method: options.method ?? 'GET',
  };

  if (options.body) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(path, init);

  const data: unknown = await response.json();

  if (!response.ok) {
    const parsed = apiErrorResponseSchema.safeParse(data);

    if (parsed.success) {
      throw new ApiClientError(parsed.data.error.message, parsed.data.error.code);
    }

    throw new ApiClientError('Request failed', 'INTERNAL_ERROR');
  }

  return data as T;
}
