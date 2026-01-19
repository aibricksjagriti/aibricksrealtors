import { NextResponse } from 'next/server';

export async function GET() {
  const uptime = process.uptime();
  
  return NextResponse.json({
    success: true,
    message: 'AI Bricks API is running',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    environment: process.env.NODE_ENV || 'development'
  });
}

