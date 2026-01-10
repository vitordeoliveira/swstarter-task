#!/usr/bin/env node

import { Worker } from 'bullmq';
import { computeAndStoreStatistics } from './lib/statistics-computation';
import { STATISTICS_JOB_NAME, QUEUE_NAME, REDIS_URL_DEFAULT, JOB_INTERVAL_MS, JOB_CLEANUP } from './lib/constants';

const redisUrl = process.env.REDIS_URL || REDIS_URL_DEFAULT;

function parseRedisUrl(url: string) {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname || 'localhost',
      port: parseInt(parsed.port || '6379'),
    };
  } catch {
    return {
      host: 'localhost',
      port: 6379,
    };
  }
}

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const now = new Date().toISOString();
    console.log(`\n🔄 Processing job ${job.id} (${job.name}) at ${now}`);
    
    try {
      const statistics = await computeAndStoreStatistics();
      
      console.log(`✅ Job ${job.id} completed successfully`);
      console.log(`⏰ Next run scheduled at: ${formatNextRunTime()}`);
      return statistics;
    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection: parseRedisUrl(redisUrl),
    concurrency: 1,
    removeOnComplete: JOB_CLEANUP.completed,
    removeOnFail: JOB_CLEANUP.failed,
  }
);

function getNextRunTime(): string {
  const now = new Date();
  const nextRun = new Date(now.getTime() + JOB_INTERVAL_MS);
  return nextRun.toISOString();
}

function formatNextRunTime(): string {
  const nextRun = getNextRunTime();
  const date = new Date(nextRun);
  return date.toLocaleString('en-US', { 
    timeZone: 'UTC',
    dateStyle: 'short',
    timeStyle: 'medium'
  }) + ' UTC';
}

worker.on('completed', (job) => {
  if (job?.name === STATISTICS_JOB_NAME) {
    console.log(`✅ Statistics job ${job.id} completed\n`);
  }
});

worker.on('failed', (job, err) => {
  if (job?.name === STATISTICS_JOB_NAME) {
    console.error(`❌ Statistics job ${job.id} failed:`, err.message);
  }
});

worker.on('error', (err) => {
  console.error('❌ Worker connection error:', err.message);
});

console.log('🚀 Statistics computation worker started');
console.log(`📡 Connecting to Redis: ${redisUrl}`);
console.log(`⏰ Next run scheduled at: ${formatNextRunTime()}\n`);

const shutdown = async () => {
  console.log('\n🛑 Shutting down worker...');
  await worker.close();
  console.log('✅ Worker shut down gracefully');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

