import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as schema from './schema';

let db: Database.Database | null = null;
let drizzleDb: ReturnType<typeof drizzle> | null = null;

function getDatabasePath(): string {
  const dataDir = process.env.DATA_DIR || join(process.cwd(), 'data');
  
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  
  return join(dataDir, 'database.db');
}

export function getDatabase(): Database.Database {
  if (db) {
    return db;
  }

  const dbPath = getDatabasePath();
  db = new Database(dbPath);

  db.pragma('journal_mode = WAL');

  db.pragma('foreign_keys = ON');

  return db;
}

export function getDrizzle() {
  if (drizzleDb) {
    return drizzleDb;
  }

  const sqlite = getDatabase();
  drizzleDb = drizzle(sqlite, { schema });
  return drizzleDb;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

if (typeof process !== 'undefined') {
  process.on('exit', () => closeDatabase());
  process.on('SIGINT', () => {
    closeDatabase();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    closeDatabase();
    process.exit(0);
  });
}

