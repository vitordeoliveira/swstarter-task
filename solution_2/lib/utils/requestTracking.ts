import { getDrizzle } from '../db';
import { requestTimings, hourlyStatistics } from '../schema';
import { sql, eq, avg, desc } from 'drizzle-orm';

async function updateHourlyStatistics(timestamp: Date): Promise<void> {
  try {
    const db = getDrizzle();
    const hour = timestamp.getUTCHours();
    
    await db
      .insert(hourlyStatistics)
      .values({ hour, count: 1 })
      .onConflictDoUpdate({
        target: hourlyStatistics.hour,
        set: { count: sql`${hourlyStatistics.count} + 1` },
      });
  } catch (error) {
    console.error('Error updating hourly statistics:', error);
  }
}

export async function trackRequestTiming(
  url: string,
  method: string,
  duration: number,
  statusCode?: number
): Promise<void> {
  try {
    const db = getDrizzle();
    const timestamp = new Date();
    
    await db.insert(requestTimings).values({
      url,
      method,
      duration,
      statusCode,
      timestamp,
    });
    
    updateHourlyStatistics(timestamp).catch((error) => {
      console.error('Error updating hourly statistics asynchronously:', error);
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

export async function getAllAverages(): Promise<Record<string, number>> {
  try {
    const db = getDrizzle();
    
    const result = await db
      .select({
        url: requestTimings.url,
        average: avg(requestTimings.duration),
      })
      .from(requestTimings)
      .groupBy(requestTimings.url);
    
    const averages: Record<string, number> = {};
    result.forEach((row) => {
      if (row.average) {
        averages[row.url] = Number(row.average);
      }
    });
    
    return averages;
  } catch (error) {
    console.error('Error getting all averages:', error);
    return {};
  }
}

export async function getAllRequests() {
  try {
    const db = getDrizzle();
    
    const result = await db
      .select()
      .from(requestTimings)
      .orderBy(desc(requestTimings.timestamp));
    
    return result.map((row) => ({
      id: row.id,
      url: row.url,
      method: row.method,
      durationMs: row.duration,
      statusCode: row.statusCode,
      timestamp: row.timestamp,
    }));
  } catch (error) {
    console.error('Error getting all requests:', error);
    return [];
  }
}

export async function getMostPopularHourOfDay(): Promise<{ hour: number; count: number } | null> {
  try {
    const db = getDrizzle();
    
    const result = await db
      .select()
      .from(hourlyStatistics)
      .orderBy(desc(hourlyStatistics.count))
      .limit(1);
    
    if (result.length === 0) {
      return null;
    }
    
    return {
      hour: result[0].hour,
      count: result[0].count,
    };
  } catch (error) {
    console.error('Error getting most popular hour:', error);
    return null;
  }
}

