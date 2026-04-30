import { NextResponse } from 'next/server';
import propertyModel from '@/lib/models/Property';
import { protect, optionalAuth } from '@/lib/middleware/auth';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';
import { normalizeFloorPlansFromBody } from '@/lib/utils/floorPlans';

// GET - Get all properties (public, but can filter by user if authenticated)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {};

    // Check if count only is requested
    const countOnly = searchParams.get('countOnly') === 'true';
    const includeTotal = searchParams.get('includeTotal') !== 'false';

    // Extract filters from query params
    if (searchParams.get('propertyType')) filters.propertyType = searchParams.get('propertyType');
    if (searchParams.get('listingType')) filters.listingType = searchParams.get('listingType');
    if (searchParams.get('propertyStatus')) filters.propertyStatus = searchParams.get('propertyStatus');
    if (searchParams.get('activeStatus')) filters.activeStatus = searchParams.get('activeStatus');
    if (searchParams.get('city')) filters.city = searchParams.get('city');
    if (searchParams.get('locality')) filters.locality = searchParams.get('locality');
    if (searchParams.get('minPrice')) filters.minPrice = searchParams.get('minPrice');
    if (searchParams.get('maxPrice')) filters.maxPrice = searchParams.get('maxPrice');
    if (searchParams.get('limit')) filters.limit = parseInt(searchParams.get('limit'), 10);

    // If count only, return just the count
    if (countOnly) {
      const totalCount = await propertyModel.getCount(filters);
      return NextResponse.json({
        success: true,
        count: totalCount
      });
    }

    // Check if user wants their own properties
    const authResult = await optionalAuth(req);
    if (authResult.user && searchParams.get('my-properties') === 'true') {
      const properties = await propertyModel.getByUserId(authResult.user.id);
      // Convert Firestore timestamps to ISO strings
      const propertiesWithConvertedDates = properties.map(property => convertTimestamps(property));
      return NextResponse.json({
        success: true,
        count: propertiesWithConvertedDates.length,
        data: propertiesWithConvertedDates
      });
    }

    const properties = await propertyModel.getAll(filters);

    // Convert Firestore timestamps to ISO strings
    const propertiesWithConvertedDates = properties.map(property => convertTimestamps(property));

    // Get total count only when the caller needs it; this avoids a second Firestore read.
    const totalCount = includeTotal
      ? await propertyModel.getCount(filters)
      : propertiesWithConvertedDates.length;

    return NextResponse.json(
      {
        success: true,
        count: totalCount,
        returned: propertiesWithConvertedDates.length,
        data: propertiesWithConvertedDates,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    logger.error('Error getting all properties:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve properties. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// POST - Create property (protected)
export async function POST(req) {
  try {
    const authResult = await protect(req);
    if (authResult.error) {
      return NextResponse.json(
        authResult.error,
        { status: authResult.error.statusCode }
      );
    }

    const body = await req.json();
    const { floorPlans, floorPlanImages } = normalizeFloorPlansFromBody(body);
    
    // Add userId to property data
    const propertyData = {
      ...body,
      floorPlans,
      floorPlanImages,
      userId: authResult.user.id,
    };

    // Map propertyTitle to title if needed
    if (body.propertyTitle || body.title) {
        propertyData.title = body.propertyTitle || body.title;
    }
    
    // Map totalPrice to price if needed
    if (body.totalPrice !== undefined || body.price !== undefined) {
        propertyData.price = body.totalPrice !== undefined ? body.totalPrice : body.price;
    }

    const property = await propertyModel.create(propertyData);

    // Convert Firestore timestamps to ISO strings
    const propertyWithConvertedDates = convertTimestamps(property);

    return NextResponse.json({
      success: true,
      message: 'Property created successfully',
      data: propertyWithConvertedDates
    }, { status: 201 });
  } catch (error) {
    logger.error('Error creating property:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create property. Please try again later.'
      },
      { status: 500 }
    );
  }
}
