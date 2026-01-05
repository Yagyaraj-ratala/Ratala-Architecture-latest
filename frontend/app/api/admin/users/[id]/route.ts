import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { username, email, password } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Get current user data
        const currentUser = await db.oneOrNone(
            'SELECT * FROM public."sign_in" WHERE id = $1',
            [id]
        );

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // RBAC: Protect 'admin' username
        if (currentUser.username.toLowerCase() === 'admin') {
            if (username && username.toLowerCase() !== 'admin') {
                return NextResponse.json(
                    { error: 'Cannot change the username of the root admin' },
                    { status: 403 }
                );
            }
        }

        // RBAC: Prevent renaming any user to 'admin'
        if (username && username.toLowerCase() === 'admin' && currentUser.username.toLowerCase() !== 'admin') {
            return NextResponse.json(
                { error: 'Cannot populate "admin" username' },
                { status: 403 }
            );
        }

        // Prepare update query
        let query = 'UPDATE public."sign_in" SET updated_at = CURRENT_TIMESTAMP';
        const values = [];
        let paramIndex = 1;

        if (username) {
            query += `, username = $${paramIndex++}`;
            values.push(username);
        }
        if (email) {
            query += `, email = $${paramIndex++}`;
            values.push(email);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += `, password_hash = $${paramIndex++}`;
            values.push(hashedPassword);
        }

        query += ` WHERE id = $${paramIndex}`;
        values.push(id);

        await db.none(query, values);

        return NextResponse.json({ message: 'User updated successfully' });

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params as per Next.js 15+ changes (good practice even if on older 14 with changes)
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Check if user is admin
        const currentUser = await db.oneOrNone(
            'SELECT username FROM public."sign_in" WHERE id = $1',
            [id]
        );

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (currentUser.username.toLowerCase() === 'admin') {
            return NextResponse.json(
                { error: 'Cannot delete the root admin user' },
                { status: 403 }
            );
        }

        await db.none('DELETE FROM public."sign_in" WHERE id = $1', [id]);

        return NextResponse.json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
