import { NextResponse } from 'next/server';
import propertyModel from '@/lib/models/Property';
import { protect } from '@/lib/middleware/auth';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';

/**
 * Get all properties owned by the currently logged-in user
 * Requires authentication
 */
export async function GET(req) {
  try {
    const authResult = await protect(req);
    if (authResult.error) {
      return NextResponse.json(
        authResult.error,
        { status: authResult.error.statusCode }
      );
    }

    const properties = await propertyModel.getByUserId(authResult.user.id);

    // Convert Firestore timestamps to ISO strings
    const propertiesWithConvertedDates = properties.map(property => convertTimestamps(property));

    return NextResponse.json({
      success: true,
      count: propertiesWithConvertedDates.length,
      data: propertiesWithConvertedDates
    });
  } catch (error) {
    logger.error('Error getting user properties:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve your properties. Please try again later.'
      },
      { status: 500 }
    );
  }
}

