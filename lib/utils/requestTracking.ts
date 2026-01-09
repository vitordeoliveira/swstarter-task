import { getDrizzle } from '../db';
import { requestTimings } from '../schema';
import { sql, eq, avg } from 'drizzle-orm';

export async function trackRequestTiming(
  url: string,
  method: string,
  duration: number,
  statusCode?: number,
  cached?: boolean
): Promise<void> {
  try {
    const db = getDrizzle();
    await db.insert(requestTimings).values({
      url,
      method,
      duration,
      statusCode,
      cached: cached ?? false,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Error tracking request timing:', error);
  }
}

export async function getAverageRequestTiming(url?: string): Promise<number | null> {
  try {
    const db = getDrizzle();
    
    const query = db
      .select({
        average: avg(requestTimings.duration),
      })
      .from(requestTimings);
    
    const result = url
      ? await query.where(eq(requestTimings.url, url))
      : await query;
    
    const average = result[0]?.average;
    return average ? Number(average) : null;
  } catch (error) {
    console.error('Error getting average request timing:', error);
    return null;
  }
}

