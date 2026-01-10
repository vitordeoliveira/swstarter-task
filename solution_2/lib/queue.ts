import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { QUEUE_NAME, STATISTICS_JOB_NAME, REDIS_URL_DEFAULT, JOB_CRON_PATTERN, JOB_CLEANUP } from './constants';

const redisUrl = process.env.REDIS_URL || REDIS_URL_DEFAULT;

let redisInstance: Redis | null = null;
let queueInstance: Queue | null = null;

function getRedis() {
  if (!redisInstance) {
    redisInstance = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      retryStrategy: (times) => {
        if (times > 3) {
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });
  }
  return redisInstance;
}

function getQueue() {
  if (!queueInstance) {
    queueInstance = new Queue(QUEUE_NAME, {
      connection: {
        host: new URL(redisUrl).hostname || 'localhost',
        port: parseInt(new URL(redisUrl).port || '6379'),
      },
    });
  }
  return queueInstance;
}

export const redis = getRedis();
export const statisticsQueue = getQueue();

export async function registerStatisticsJob() {
  try {
    const redisConnection = getRedis();
    if (redisConnection.status !== 'ready' && redisConnection.status !== 'connecting') {
      await redisConnection.connect();
    }
    
    const queue = getQueue();
    await queue.add(
      STATISTICS_JOB_NAME,
      {},
      {
        repeat: {
          pattern: JOB_CRON_PATTERN,
        },
        removeOnComplete: JOB_CLEANUP.completed,
        removeOnFail: JOB_CLEANUP.failed,
      }
    );

    console.log('✅ Statistics computation job registered (runs every 5 minutes)');
  } catch (error) {
    console.error('❌ Error registering statistics job:', error);
    throw error;
  }
}

export async function closeQueue() {
  if (queueInstance) {
    await queueInstance.close();
  }
  if (redisInstance) {
    await redisInstance.quit();
  }
}

