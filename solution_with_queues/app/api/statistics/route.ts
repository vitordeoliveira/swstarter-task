import { NextResponse } from 'next/server';
import { getCachedStatistics } from '@/lib/statistics-computation';
import { getAllAverages, getMostPopularHourOfDay, getTopFiveQueriesWithPercentages } from '@/lib/utils/requestTracking';

const statisticsUrls = [
  '/api/statistics/requests',
  "/api/statistics",
]

export async function GET() {
  try {
    const cachedStats = await getCachedStatistics();
    
    if (cachedStats) {
      return NextResponse.json({...cachedStats, urls: statisticsUrls});
    }

    console.warn('No cached statistics found, computing on-demand');
    const [averages, mostPopularHour, topFiveQueries] = await Promise.all([
      getAllAverages(),
      getMostPopularHourOfDay(),
      getTopFiveQueriesWithPercentages(),
    ]);

    return NextResponse.json({
      unit: 'milliseconds',
      timezone: 'UTC',
      averages,
      mostPopularHourOfDay: mostPopularHour,
      topFiveQueries,
      urls: statisticsUrls,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

