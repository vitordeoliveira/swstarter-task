import { Queue } from 'bullmq';
import { QUEUE_NAME, STATISTICS_JOB_NAME, REDIS_URL_DEFAULT, JOB_CRON_PATTERN, JOB_CLEANUP } from './constants';

const redisUrl = process.env.REDIS_URL || REDIS_URL_DEFAULT;

let queueInstance: Queue | null = null;

function getQueue() {
  if (!queueInstance) {
    queueInstance = new Queue(QUEUE_NAME, {
      connection: {
        host: new URL(redisUrl).hostname || 'localhost',
        port: parseInt(new URL(redisUrl).port || '6379'),
      },
    });
  }

  queueInstance.on('error', (error) => {
    console.error('❌ Queue error: make sure Redis is running');
    console.error('Current redis url: ', redisUrl);
  });

  return queueInstance;
}

export const statisticsQueue = getQueue();

export async function registerStatisticsJob() {
  try {
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
}

