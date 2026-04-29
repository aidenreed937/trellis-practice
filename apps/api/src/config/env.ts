import { z } from 'zod';

const envSchema = z.object({
  API_PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().default('file:./apps/api/data/dev.db'),
});

export type ApiEnv = z.infer<typeof envSchema>;

export function readEnv(input: NodeJS.ProcessEnv = process.env): ApiEnv {
  return envSchema.parse(input);
}
