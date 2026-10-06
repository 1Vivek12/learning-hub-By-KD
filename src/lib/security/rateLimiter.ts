import { prisma } from "@/lib/db/prisma";

export class RateLimiter {
  /**
   * Consumes a point from the rate limit counter for a given key.
   * Uses an atomic upsert operation via Prisma to prevent race conditions.
   * 
   * @param key The unique identifier for the rate limit (e.g., "auth:login:ip:192.168.1.1")
   * @param limit The maximum number of points allowed in the window
   * @param windowMs The time window in milliseconds (e.g., 900000 for 15 minutes)
   * @returns Object containing success boolean and remaining points.
   */
  static async consume(key: string, limit: number, windowMs: number): Promise<{ success: boolean; remaining: number }> {
    const now = new Date();
    
    try {
      // Clean up old expired records asynchronously (10% chance to run to avoid overhead)
      if (Math.random() < 0.1) {
        prisma.rateLimit.deleteMany({
          where: { expiresAt: { lt: now } }
        }).catch(() => {}); // Fire and forget
      }

      // We use an atomic upsert. If the record exists and hasn't expired, increment points.
      // If it doesn't exist (or we delete it because it expired), we create a new one.
      
      // Step 1: Check existing record
      const existing = await prisma.rateLimit.findUnique({
        where: { key }
      });

      if (existing && existing.expiresAt < now) {
        // Expired, reset it
        const resetRecord = await prisma.rateLimit.update({
          where: { key },
          data: {
            points: 1,
            expiresAt: new Date(now.getTime() + windowMs),
          }
        });
        return { success: true, remaining: limit - 1 };
      }

      if (existing) {
        if (existing.points >= limit) {
          return { success: false, remaining: 0 };
        }
        
        // Atomic increment
        const updatedRecord = await prisma.rateLimit.update({
          where: { key },
          data: {
            points: { increment: 1 }
          }
        });
        
        return { success: updatedRecord.points <= limit, remaining: Math.max(0, limit - updatedRecord.points) };
      }

      // Step 2: Doesn't exist, create it (with upsert for race condition safety)
      const newRecord = await prisma.rateLimit.upsert({
        where: { key },
        update: { points: { increment: 1 } },
        create: {
          key,
          points: 1,
          expiresAt: new Date(now.getTime() + windowMs),
        }
      });
      
      return { success: newRecord.points <= limit, remaining: Math.max(0, limit - newRecord.points) };
      
    } catch (error) {
      // In case of database failure (e.g., timeout, connection issues), 
      // fail-open to not block legitimate users from authenticating.
      console.error("Rate Limiter Error:", error);
      return { success: true, remaining: limit - 1 };
    }
  }

  /**
   * Resets the rate limit for a specific key (e.g. after successful login).
   */
  static async reset(key: string): Promise<void> {
    try {
      await prisma.rateLimit.delete({
        where: { key }
      });
    } catch (error: any) {
      // Ignore if record doesn't exist
      if (error.code !== 'P2025') {
        console.error("Rate Limiter Reset Error:", error);
      }
    }
  }
}
