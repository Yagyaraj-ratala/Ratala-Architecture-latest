import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Verify: No authorization header or invalid format');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    if (!token || token.trim() === '') {
      console.error('Verify: Empty token');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check JWT_SECRET
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
      console.error('Verify: JWT_SECRET is not configured!');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Verify JWT token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // Verify user still exists in database
      if (!decoded || !decoded.userId) {
        console.error('❌ Verify: Invalid token payload - no userId');
        return NextResponse.json(
          { error: 'Invalid token payload' },
          { status: 401 }
        );
      }

      const user = await db.oneOrNone(
        'SELECT id, username, email, role FROM public."sign_in" WHERE id = $1',
        [decoded.userId]
      );

      if (!user) {
        console.error('❌ Verify: User not found in database for ID:', decoded.userId);
        return NextResponse.json({ valid: false }, { status: 401 });
      }

      return NextResponse.json({
        valid: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error: any) {
      // Log the actual error for debugging
      console.error('JWT verification error:', error.message);

      return NextResponse.json(
        {
          error: 'Invalid token',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

