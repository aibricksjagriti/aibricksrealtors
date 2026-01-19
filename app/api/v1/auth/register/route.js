import { NextResponse } from 'next/server';
import userModel from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@/lib/config';
import logger from '@/lib/logger';

function generateToken(id) {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, phoneNumber } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, email, and password are required'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userModel.getByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists'
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phoneNumber: phoneNumber || null,
      role: 'user',
      isActive: true
    };

    const user = await userModel.create(userData);

    // Remove password from response
    delete user.password;

    // Generate token
    const token = generateToken(user.id);

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    }, { status: 201 });
  } catch (error) {
    logger.error('Error registering user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register user. Please try again later.'
      },
      { status: 500 }
    );
  }
}

