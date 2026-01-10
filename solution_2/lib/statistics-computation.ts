import { getDrizzle } from './db';
import { computedStatistics } from './schema';
import { getAllAverages, getMostPopularHourOfDay } from './utils/requestTracking';
import { sql } from 'drizzle-orm';

export interface StatisticsData {
  unit: string;
  timezone: string;
  averages: Record<string, number>;
  mostPopularHourOfDay: { hour: number; count: number } | null;
}

export async function computeAndStoreStatistics(): Promise<StatisticsData> {
  try {
    const [averages, mostPopularHour] = await Promise.all([
      getAllAverages(),
      getMostPopularHourOfDay(),
    ]);

    const statistics: StatisticsData = {
      unit: 'milliseconds',
      timezone: 'UTC',
      averages,
      mostPopularHourOfDay: mostPopularHour,
    };

    const db = getDrizzle();
    const dataJson = JSON.stringify(statistics);
    const computedAt = new Date();

    await db.delete(computedStatistics);
    await db.insert(computedStatistics).values({
      data: dataJson,
      computedAt,
    });

    console.log('✅ Statistics computed and stored:', {
      urlCount: Object.keys(averages).length,
      mostPopularHour: mostPopularHour?.hour ?? null,
      computedAt: computedAt.toISOString(),
    });

    return statistics;
  } catch (error) {
    console.error('❌ Error computing statistics:', error);
    throw error;
  }
}

export async function getCachedStatistics(): Promise<StatisticsData | null> {
  try {
    const db = getDrizzle();
    const result = await db
      .select()
      .from(computedStatistics)
      .orderBy(sql`${computedStatistics.computedAt} DESC`)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return JSON.parse(result[0].data) as StatisticsData;
  } catch (error) {
    console.error('Error retrieving cached statistics:', error);
    return null;
  }
}

