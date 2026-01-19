import { NextResponse } from 'next/server';
import interestedModel from '@/lib/models/Interested';
import { protect } from '@/lib/middleware/auth';
import { authorizeAdmin } from '@/lib/middleware/authorize';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';

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

    const { id } = await params;
    const submission = await interestedModel.getById(id);

    if (!submission) {
      return NextResponse.json(
        {
          success: false,
          error: 'Submission not found'
        },
        { status: 404 }
      );
    }

    // Convert Firestore timestamps to ISO strings
    const submissionWithConvertedDates = convertTimestamps(submission);

    return NextResponse.json({
      success: true,
      data: submissionWithConvertedDates
    });
  } catch (error) {
    logger.error('Error getting interested submission by ID:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve submission. Please try again later.'
      },
      { status: 500 }
    );
  }
}

