import { NextResponse } from 'next/server';
import propertyModel from '@/lib/models/Property';
import logger from '@/lib/logger';
import { convertTimestamps } from '@/lib/utils/timestampConverter';

/**
 * Advanced search with filters
 * Supports: propertyType, location, developer, price, handover, and text search
 * Also handles simple text-only search for backward compatibility
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    
    // If only 'q' is provided and no other filters, use simple search for backward compatibility
    const hasFilters = searchParams.get('propertyType') || searchParams.get('city') || 
                      searchParams.get('locality') || searchParams.get('state') || 
                      searchParams.get('developer') || searchParams.get('builder') || searchParams.get('minPrice') || 
                      searchParams.get('maxPrice') || searchParams.get('handover') || 
                      searchParams.get('propertyStatus') || searchParams.get('sortBy') || 
                      searchParams.get('page') || searchParams.get('limit');
    
    if (q && !hasFilters) {
      // Simple text search (backward compatible)
      if (q.trim().length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Search query is required'
        }, { status: 400 });
      }
      
      const properties = await propertyModel.searchByTitle(q.trim());

      // Convert Firestore timestamps to ISO strings
      const propertiesWithConvertedDates = properties.map(property => convertTimestamps(property));

      return NextResponse.json({
        success: true,
        count: propertiesWithConvertedDates.length,
        data: propertiesWithConvertedDates
      });
    }

    // Advanced search with filters
    const filters = {
      // Property Type filter
      propertyType: searchParams.get('propertyType'),
      
      // Location filters
      city: searchParams.get('city'),
      locality: searchParams.get('locality'),
      state: searchParams.get('state'),
      
      // Developer/Builder filter (searches builderName and projectName)
      // Accept both 'developer' and 'builder' as query parameters (they are the same)
      developer: searchParams.get('developer') || searchParams.get('builder'),
      
      // Price filters
      minPrice: searchParams.get('minPrice'),
      maxPrice: searchParams.get('maxPrice'),
      
      // Handover filter (propertyStatus)
      propertyStatus: searchParams.get('handover') || searchParams.get('propertyStatus'),
      
      // Text search (searches across multiple fields)
      searchText: searchParams.get('q') || searchParams.get('search'),
      
      // Sorting
      sortBy: searchParams.get('sortBy'), // 'price_asc', 'price_desc', 'newest', or default by date
      
      // Pagination
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
      
      // Active status (default to 'Yes' if not specified, but allow empty to search all)
      activeStatus: searchParams.get('activeStatus') || 'Yes'
    };

    // Remove undefined/null filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined || filters[key] === null || filters[key] === '') {
        delete filters[key];
      }
    });

    // Perform advanced search
    const searchResult = await propertyModel.advancedSearch(filters);
    
    logger.info('Search filters:', JSON.stringify(filters));
    logger.info('Search result:', {
      resultsCount: searchResult.results?.length || 0,
      total: searchResult.total || 0,
      page: searchResult.page || 1,
      limit: searchResult.limit || 20
    });

    // Seller info is already embedded in property documents - no additional queries needed!
    // Developer filtering is already done in the model's advancedSearch method
    // No need for additional filtering here
    const finalResults = searchResult.results || [];

    // Convert Firestore timestamps to ISO strings
    const finalResultsWithConvertedDates = finalResults.map(property => convertTimestamps(property));

    logger.info('Returning results count:', finalResultsWithConvertedDates.length);

    return NextResponse.json({
      success: true,
      count: finalResultsWithConvertedDates.length,
      total: searchResult.total || 0,
      page: searchResult.page || 1,
      limit: searchResult.limit || 20,
      totalPages: searchResult.totalPages || 0,
      data: finalResultsWithConvertedDates
    });
  } catch (error) {
    logger.error('Error in advanced search:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform search. Please try again later.'
      },
      { status: 500 }
    );
  }
}

