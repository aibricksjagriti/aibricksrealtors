import { NextResponse } from 'next/server';
import propertyModel from '@/lib/models/Property';
import { protect } from '@/lib/middleware/auth';
import { authorizeProperty } from '@/lib/middleware/authorize';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';

// GET - Get property by ID (public)
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const property = await propertyModel.getById(id);

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }

    // Convert Firestore timestamps to ISO strings for proper JSON serialization
    const propertyWithConvertedDates = convertTimestamps(property);

    return NextResponse.json({
      success: true,
      data: propertyWithConvertedDates
    });
  } catch (error) {
    logger.error('Error getting property:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve property. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// PUT - Update property (protected, owner only)
export async function PUT(req, { params }) {
  try {
    const authResult = await protect(req);
    if (authResult.error) {
      return NextResponse.json(
        authResult.error,
        { status: authResult.error.statusCode }
      );
    }

    const { id } = await params;
    
    // Check authorization (admins can edit any property)
    const authzResult = await authorizeProperty(authResult.user, id);
    if (authzResult.error) {
      return NextResponse.json(
        authzResult.error,
        { status: authzResult.error.statusCode }
      );
    }

    const body = await req.json();
    const property = await propertyModel.update(id, body);

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }

    // Convert Firestore timestamps to ISO strings
    const propertyWithConvertedDates = convertTimestamps(property);

    return NextResponse.json({
      success: true,
      message: 'Property updated successfully',
      data: propertyWithConvertedDates
    });
  } catch (error) {
    logger.error('Error updating property:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update property. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete property (protected, owner only)
export async function DELETE(req, { params }) {
  try {
    const authResult = await protect(req);
    if (authResult.error) {
      return NextResponse.json(
        authResult.error,
        { status: authResult.error.statusCode }
      );
    }

    const { id } = await params;
    
    // Check authorization (admins can edit any property)
    const authzResult = await authorizeProperty(authResult.user, id);
    if (authzResult.error) {
      return NextResponse.json(
        authzResult.error,
        { status: authzResult.error.statusCode }
      );
    }

    const deleted = await propertyModel.delete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Property not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting property:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete property. Please try again later.'
      },
      { status: 500 }
    );
  }
}

