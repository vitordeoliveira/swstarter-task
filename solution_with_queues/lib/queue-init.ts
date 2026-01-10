import { registerStatisticsJob } from './queue';

let jobRegistered = false;

export async function initializeQueue() {
  if (jobRegistered) {
    return;
  }

  try {
    await registerStatisticsJob();
    jobRegistered = true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      console.error('❌ Failed to connect to Redis. Make sure Redis is running.');
      console.error('   Start Redis with: docker run -d -p 6379:6379 redis:7-alpine');
      console.error('   Or use: docker-compose up redis');
    } else {
      console.error('Failed to initialize queue:', error);
    }
  }
}

