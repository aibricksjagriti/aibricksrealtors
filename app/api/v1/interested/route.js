import { NextResponse } from 'next/server';
import interestedModel from '@/lib/models/Interested';
import { protect } from '@/lib/middleware/auth';
import { authorizeAdmin } from '@/lib/middleware/authorize';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';

// POST - Submit interested form (public)
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, propertyId, propertyTitle, message } = body;

    // All fields are optional - no validation required

    const interested = await interestedModel.create({
      name: name || null,
      phone: phone || null,
      email: email || null,
      propertyId: propertyId || null,
      propertyTitle: propertyTitle || null,
      message: message || null
    });

    logger.info(`New interested submission: ${interested.id}`);

    // Convert Firestore timestamps to ISO strings
    const interestedWithConvertedDates = convertTimestamps(interested);

    return NextResponse.json({
      success: true,
      message: 'Submission successful',
      data: interestedWithConvertedDates
    }, { status: 201 });
  } catch (error) {
    logger.error('Error submitting interested form:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// GET - Get all interested submissions (admin only)
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
    const submissions = await interestedModel.getAll(validLimit, startAfter);

    // Convert Firestore timestamps to ISO strings
    const submissionsWithConvertedDates = submissions.map(submission => convertTimestamps(submission));

    return NextResponse.json({
      success: true,
      count: submissionsWithConvertedDates.length,
      limit: validLimit,
      data: submissionsWithConvertedDates
    });
  } catch (error) {
    logger.error('Error getting all interested submissions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve submissions. Please try again later.'
      },
      { status: 500 }
    );
  }
}

