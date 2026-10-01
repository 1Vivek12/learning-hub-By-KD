import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    // 1. Check Database Connectivity safely
    let dbStatus = 'disconnected';
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (e) {
      dbStatus = 'error';
    }

    // 2. Check essential config flags without exposing values
    const configStatus = {
      razorpay: !!process.env.RAZORPAY_KEY_SECRET,
      livekit: !!process.env.LIVEKIT_API_SECRET,
      storage: !!process.env.STORAGE_PROVIDER,
      auth: !!process.env.AUTH_SECRET,
    };

    const isHealthy = dbStatus === 'connected';

    return NextResponse.json(
      {
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: dbStatus,
        },
        config: configStatus,
      },
      { status: isHealthy ? 200 : 503 }
    );
  } catch (error) {
    console.error('[HealthCheck] Error checking health', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
