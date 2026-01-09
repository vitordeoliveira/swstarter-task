import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const requestTimings = sqliteTable('request_timings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  url: text('url').notNull(),
  method: text('method').notNull().default('GET'),
  duration: integer('duration').notNull(),
  statusCode: integer('status_code'),
  cached: integer('cached', { mode: 'boolean' }).notNull().default(false),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});

