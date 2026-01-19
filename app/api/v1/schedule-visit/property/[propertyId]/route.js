import { NextResponse } from 'next/server';
import scheduleVisitModel from '@/lib/models/ScheduleVisit';
import { protect } from '@/lib/middleware/auth';
import { authorizeAdmin } from '@/lib/middleware/authorize';
import logger from '@/lib/logger';

export async function GET(req, { params }) {
  try {
    const authResult = await protect(req);
    if (authResult.error) {
      return NextResponse.json(
        authResult.error,
        { status: authResult.error.statusCode }
      );
    }

    const adminCheck = authorizeAdmin(authResult.user);
    if (adminCheck.error) {
      return NextResponse.json(
        adminCheck.error,
        { status: adminCheck.error.statusCode }
      );
    }

    const { propertyId } = await params;
    const visits = await scheduleVisitModel.getByPropertyId(propertyId);

    return NextResponse.json({
      success: true,
      count: visits.length,
      data: visits
    });
  } catch (error) {
    logger.error('Error getting visits by property:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve visits. Please try again later.'
      },
      { status: 500 }
    );
  }
}

