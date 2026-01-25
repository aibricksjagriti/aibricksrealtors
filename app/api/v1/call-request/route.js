import { NextResponse } from 'next/server';
import callRequestModel from '@/lib/models/CallRequest';
import { protect } from '@/lib/middleware/auth';
import { authorizeAdmin } from '@/lib/middleware/authorize';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';

// POST - Create a call request
export async function POST(req) {
  try {
    const body = await req.json();
    const { phoneNumber, propertyId, propertyTitle } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Phone number is required'
        },
        { status: 400 }
      );
    }

    const request = await callRequestModel.create({
      phoneNumber,
      propertyId,
      propertyTitle
    });

    logger.info(`New call request created: ${request.id}`);

    return NextResponse.json({
      success: true,
      message: 'Request submitted successfully',
      data: convertTimestamps(request)
    }, { status: 201 });
  } catch (error) {
    logger.error('Error creating call request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit request'
      },
      { status: 500 }
    );
  }
}

// GET - Get all call requests (Admin only)
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

    const requests = await callRequestModel.getAll(limit);
    const convertedRequests = requests.map(req => convertTimestamps(req));

    return NextResponse.json({
      success: true,
      count: convertedRequests.length,
      data: convertedRequests
    });
  } catch (error) {
    logger.error('Error getting call requests:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve requests'
      },
      { status: 500 }
    );
  }
}
