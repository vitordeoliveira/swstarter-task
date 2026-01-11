import { NextResponse } from 'next/server';
import { getAllAverages, getMostPopularHourOfDay, getTopFiveQueriesWithPercentages } from '@/lib/utils/requestTracking';

const statisticsUrls = [
  '/api/statistics/requests',
  "/api/statistics",
];
export async function GET() {
  try {
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

