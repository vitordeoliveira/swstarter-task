export const QUEUE_NAME = 'statistics-computation';
export const STATISTICS_JOB_NAME = 'compute-statistics';

const jobIntervalMinutesEnv = process.env.JOB_INTERVAL_MINUTES;
export const JOB_INTERVAL_MINUTES: number = jobIntervalMinutesEnv ? Number(jobIntervalMinutesEnv) : 5;
export const JOB_CRON_PATTERN = `*/${JOB_INTERVAL_MINUTES} * * * *`;
export const JOB_INTERVAL_MS = JOB_INTERVAL_MINUTES * 60 * 1000;

export const REDIS_URL_DEFAULT = 'redis://localhost:6379';

export const JOB_CLEANUP = {
  completed: {
    age: 3600,
    count: 10,
  },
  failed: {
    age: 86400,
  },
};

