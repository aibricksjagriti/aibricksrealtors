import { NextResponse } from 'next/server';
import userModel from '@/lib/models/User';
import { protect } from '@/lib/middleware/auth';
import logger from '@/lib/logger';

export async function PUT(req) {
  try {
    const authResult = await protect(req);
    if (authResult.error) {
      return NextResponse.json(
        authResult.error,
        { status: authResult.error.statusCode }
      );
    }

    const body = await req.json();
    const { name, phoneNumber } = body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    const user = await userModel.update(authResult.user.id, updateData);

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
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    logger.error('Error updating profile:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update profile. Please try again later.'
      },
      { status: 500 }
    );
  }
}

