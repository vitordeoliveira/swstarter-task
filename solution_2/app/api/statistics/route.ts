import { NextResponse } from 'next/server';
import { getCachedStatistics } from '@/lib/statistics-computation';
import { getAllAverages, getMostPopularHourOfDay } from '@/lib/utils/requestTracking';

export async function GET() {
  try {
    const cachedStats = await getCachedStatistics();
    
    if (cachedStats) {
      return NextResponse.json(cachedStats);
    }

    console.warn('No cached statistics found, computing on-demand');
    const [averages, mostPopularHour] = await Promise.all([
      getAllAverages(),
      getMostPopularHourOfDay(),
    ]);

    return NextResponse.json({
      unit: 'milliseconds',
      timezone: 'UTC',
      averages,
      mostPopularHourOfDay: mostPopularHour,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

