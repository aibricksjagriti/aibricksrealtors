import { NextResponse } from 'next/server';
import contactModel from '@/lib/models/Contact';
import { protect } from '@/lib/middleware/auth';
import { authorizeAdmin } from '@/lib/middleware/authorize';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';

export async function GET(req, { params }) {
  try {
    // Check authentication
    const authResult = await protect(req);
    if (authResult.error) {
      return NextResponse.json(
        authResult.error,
        { status: authResult.error.statusCode }
      );
    }

    // Check admin authorization
    const adminCheck = authorizeAdmin(authResult.user);
    if (adminCheck.error) {
      return NextResponse.json(
        adminCheck.error,
        { status: adminCheck.error.statusCode }
      );
    }

    const { id } = await params;
    const contact = await contactModel.getById(id);

    if (!contact) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact submission not found'
        },
        { status: 404 }
      );
    }

    // Convert Firestore timestamps to ISO strings
    const contactWithConvertedDates = convertTimestamps(contact);

    return NextResponse.json({
      success: true,
      data: contactWithConvertedDates
    });
  } catch (error) {
    logger.error('Error getting contact by ID:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve contact. Please try again later.'
      },
      { status: 500 }
    );
  }
}

