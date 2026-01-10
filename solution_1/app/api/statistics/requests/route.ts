import { NextResponse } from 'next/server';
import { getAllRequests } from '@/lib/utils/requestTracking';

export async function GET() {
  try {
    const requests = await getAllRequests();

    return NextResponse.json({
      requests,
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

