import { defineConfig } from 'drizzle-kit';
import { join } from 'path';

export default defineConfig({
  dialect: 'sqlite',
  schema: './lib/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: join(process.cwd(), 'data', 'database.db'),
  },
});

