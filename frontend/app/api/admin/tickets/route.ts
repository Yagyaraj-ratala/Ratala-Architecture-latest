import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        await requireAuth(request);

        const tickets = await db.query(
            'SELECT * FROM public.tickets ORDER BY created_at DESC'
        );

        return NextResponse.json(tickets.rows);
    } catch (error: any) {
        console.error('Admin Tickets GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
