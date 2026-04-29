import { readEnv } from './config/env';
import { createDb } from './db/client';
import { runMigrations } from './db/migrate';
import { createApp } from './app';

const env = readEnv();

runMigrations(env.DATABASE_URL);

const db = createDb(env.DATABASE_URL);
const app = await createApp({ db });

try {
  await app.listen({ port: env.API_PORT, host: '0.0.0.0' });
} catch (error) {
  app.log.error({ error }, 'Failed to start API server');
  await db.destroy();
  process.exit(1);
}

const shutdown = async () => {
  await app.close();
  await db.destroy();
};

process.on('SIGINT', () => {
  void shutdown().then(() => process.exit(0));
});

process.on('SIGTERM', () => {
  void shutdown().then(() => process.exit(0));
});
