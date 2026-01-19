import { NextResponse } from 'next/server';
import propertyModel from '@/lib/models/Property';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';

/**
 * Get trending projects sorted by view count
 * Returns most viewed properties
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Limit max results to 50
    const validLimit = Math.min(limit, 50);
    
    const properties = await propertyModel.getTrendingProjects(validLimit);

    // Convert Firestore timestamps to ISO strings
    const propertiesWithConvertedDates = properties.map(property => convertTimestamps(property));

    return NextResponse.json({
      success: true,
      count: propertiesWithConvertedDates.length,
      data: propertiesWithConvertedDates
    });
  } catch (error) {
    logger.error('Error getting trending projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve trending projects. Please try again later.'
      },
      { status: 500 }
    );
  }
}

