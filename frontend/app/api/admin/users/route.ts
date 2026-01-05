import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function GET() {
    try {
        const users = await db.query(
            'SELECT id, username, email, role, created_at FROM public."sign_in" ORDER BY id ASC'
        );
        return NextResponse.json(users.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // RBAC: Prevent creation of "admin" user via API
        if (username.toLowerCase() === 'admin') {
            return NextResponse.json(
                { error: 'Creation of "admin" user is restricted to SQL shell' },
                { status: 403 }
            );
        }

        // Check if user already exists
        const existingUser = await db.oneOrNone(
            'SELECT id FROM public."sign_in" WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser) {
            return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Explicitly set role to 'user'
        const role = 'user';

        const newUser = await db.one(
            'INSERT INTO public."sign_in" (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at',
            [username, email, hashedPassword, role]
        );

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
