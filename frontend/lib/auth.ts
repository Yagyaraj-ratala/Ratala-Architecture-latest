import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from './db';

// Get JWT_SECRET from environment variable
// In Next.js, environment variables need to be accessed at build/runtime
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Log if JWT_SECRET is not properly configured (only in development)
if (process.env.NODE_ENV === 'development' && (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production')) {
  console.warn('⚠️  JWT_SECRET is not properly configured. Please set it in .env.local');
}

export interface AuthUser {
  userId: string;
  email: string;
  username: string;
  role?: string;
}

/**
 * Verify JWT token from request headers
 * Returns user data if valid, null if invalid
 */
export async function verifyToken(request: Request | NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth: No authorization header or invalid format');
      return null;
    }

    const token = authHeader.substring(7);

    if (!token || token.trim() === '') {
      console.log('Auth: Empty token');
      return null;
    }

    // Check if JWT_SECRET is set
    if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
      console.error('Auth: JWT_SECRET is not properly configured');
      return null;
    }

    // Verify JWT token - try with issuer/audience first, fallback to basic verification
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'ratala-architecture',
        audience: 'ratala-admin'
      }) as any;
    } catch (verifyError: any) {
      // If issuer/audience validation fails, try without them (for backward compatibility)
      try {
        decoded = jwt.verify(token, JWT_SECRET) as any;
      } catch (basicError: any) {
        console.error('Auth: JWT verification failed:', basicError.message);
        return null;
      }
    }

    if (!decoded || !decoded.userId) {
      console.log('Auth: Invalid token payload - no userId');
      return null;
    }

    // Verify user still exists in database
    const user = await db.oneOrNone(
      'SELECT id, email, username, role FROM public."sign_in" WHERE id = $1',
      [decoded.userId]
    );

    if (!user) {
      console.log('Auth: User not found in database');
      return null;
    }

    return {
      userId: user.id.toString(),
      email: user.email,
      username: user.username || user.email, // Use real username if available
      role: user.role,
    };
  } catch (error: any) {
    console.error('Auth: Unexpected error in verifyToken:', error.message);
    return null;
  }
}

/**
 * Middleware to protect API routes
 * Returns user if authenticated, throws error if not
 */
export async function requireAuth(request: Request | NextRequest): Promise<AuthUser> {
  const user = await verifyToken(request);

  if (!user) {
    // Log more details about why verification failed
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('requireAuth: No authorization header');
    } else if (!authHeader.startsWith('Bearer ')) {
      console.error('requireAuth: Invalid authorization header format');
    } else {
      const token = authHeader.substring(7);
      console.error('requireAuth: Token verification failed for token:', token.substring(0, 20) + '...');
    }
    throw new Error('Unauthorized');
  }

  return user;
}

