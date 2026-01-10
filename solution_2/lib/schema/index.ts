import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const requestTimings = sqliteTable('request_timings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  url: text('url').notNull(),
  method: text('method').notNull().default('GET'),
  duration: integer('duration').notNull(),
  statusCode: integer('status_code'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
});

export const hourlyStatistics = sqliteTable('hourly_statistics', {
  hour: integer('hour').primaryKey(),
  count: integer('count').notNull().default(0),
});

