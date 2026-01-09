import { NextResponse } from 'next/server';
import { getAllAverages, getMostPopularHourOfDay } from '@/lib/utils/requestTracking';

export async function GET() {
  try {
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

