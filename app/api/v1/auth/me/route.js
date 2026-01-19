import { NextResponse } from 'next/server';
import { protect } from '@/lib/middleware/auth';
import userModel from '@/lib/models/User';
import logger from '@/lib/logger';

export async function GET(req) {
  try {
    const authResult = await protect(req);
    
    if (authResult.error) {
      return NextResponse.json(
        authResult.error,
        { status: authResult.error.statusCode }
      );
    }

    const user = await userModel.getById(authResult.user.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      );
    }

    // Remove password from response
    delete user.password;

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('Error getting user profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Server error'
      },
      { status: 500 }
    );
  }
}

