import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    // Check if request has body
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email only
    const user = await db.oneOrNone(
      'SELECT id, username, email, password_hash, role, created_at FROM public."sign_in" WHERE email = $1',
      [email]
    );

    // If user doesn't exist, return error
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    // If password is invalid, return error
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check JWT_SECRET before signing
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
      console.error('❌ Signin: JWT_SECRET is not configured!');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email || user.username,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );


    // If everything is valid, return success with token
    return NextResponse.json(
      {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email || user.username,
          username: user.username,
          role: user.role,
          created_at: user.created_at
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
