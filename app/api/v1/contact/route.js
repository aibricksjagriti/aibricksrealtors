import { NextResponse } from 'next/server';
import contactModel from '@/lib/models/Contact';
import { protect } from '@/lib/middleware/auth';
import { authorizeAdmin } from '@/lib/middleware/authorize';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';

// POST - Submit contact form (public)
export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, message } = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'First name, last name, email, and phone are required'
        },
        { status: 400 }
      );
    }

    const contact = await contactModel.create({
      firstName,
      lastName,
      email,
      phone,
      message
    });

    logger.info(`New contact submission created: ${contact.id}`);

    // Convert Firestore timestamps to ISO strings
    const contactWithConvertedDates = convertTimestamps(contact);

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: contactWithConvertedDates.id,
        firstName: contactWithConvertedDates.firstName,
        lastName: contactWithConvertedDates.lastName,
        email: contactWithConvertedDates.email,
        phone: contactWithConvertedDates.phone,
        createdAt: contactWithConvertedDates.createdAt
      }
    }, { status: 201 });
  } catch (error) {
    logger.error('Error submitting contact form:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit contact form. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// GET - Get all contacts (admin only)
export async function GET(req) {
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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit'), 10) || 50;
    const startAfter = searchParams.get('startAfter') || null;

    const validLimit = Math.min(Math.max(limit, 1), 100);
    const contacts = await contactModel.getAll(validLimit, startAfter);

    // Convert Firestore timestamps to ISO strings
    const contactsWithConvertedDates = contacts.map(contact => convertTimestamps(contact));

    return NextResponse.json({
      success: true,
      count: contactsWithConvertedDates.length,
      limit: validLimit,
      data: contactsWithConvertedDates
    });
  } catch (error) {
    logger.error('Error getting all contacts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve contacts. Please try again later.'
      },
      { status: 500 }
    );
  }
}

