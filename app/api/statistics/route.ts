import { NextResponse } from 'next/server';
import { getAllAverages, getAllRequests } from '@/lib/utils/requestTracking';

export async function GET() {
  try {
    const [averages, requests] = await Promise.all([
      getAllAverages(),
      getAllRequests(),
    ]);

    return NextResponse.json({
      unit: 'milliseconds',
      averages,
      requests,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

