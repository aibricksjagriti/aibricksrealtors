import { NextResponse } from 'next/server';
import scheduleVisitModel from '@/lib/models/ScheduleVisit';
import { protect } from '@/lib/middleware/auth';
import { authorizeAdmin } from '@/lib/middleware/authorize';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';

// POST - Schedule a visit (public)
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, propertyId, date, time, message } = body;

    if (!name || !phone || !date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, phone, and date are required'
        },
        { status: 400 }
      );
    }

    const visit = await scheduleVisitModel.create({
      name,
      phone,
      email,
      propertyId,
      preferredDate: date,
      preferredTime: time,
      message
    });

    logger.info(`New visit scheduled: ${visit.id}`);

    // Convert Firestore timestamps to ISO strings
    const visitWithConvertedDates = convertTimestamps(visit);

    return NextResponse.json({
      success: true,
      message: 'Visit scheduled successfully',
      data: visitWithConvertedDates
    }, { status: 201 });
  } catch (error) {
    logger.error('Error scheduling visit:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to schedule visit. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// GET - Get all visits (admin only)
export async function GET(req) {
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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit'), 10) || 50;
    const startAfter = searchParams.get('startAfter') || null;

    const validLimit = Math.min(Math.max(limit, 1), 100);
    const visits = await scheduleVisitModel.getAll(validLimit, startAfter);

    // Convert Firestore timestamps to ISO strings
    const visitsWithConvertedDates = visits.map(visit => convertTimestamps(visit));

    return NextResponse.json({
      success: true,
      count: visitsWithConvertedDates.length,
      limit: validLimit,
      data: visitsWithConvertedDates
    });
  } catch (error) {
    logger.error('Error getting all visits:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve visits. Please try again later.'
      },
      { status: 500 }
    );
  }
}

