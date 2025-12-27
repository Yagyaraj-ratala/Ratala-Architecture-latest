import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Find user by username
    const user = await db.oneOrNone(
      'SELECT * FROM public."SIGN_IN" WHERE username = $1',
      [username]
    );

    // 2. If user doesn't exist, return error
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // 3. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    // 4. If password is invalid, return error
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // 5. If everything is valid, return success
    return NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
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
