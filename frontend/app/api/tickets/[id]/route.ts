import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth(request);
        const { id } = await params;
        const { status } = await request.json();

        if (!status || (status !== 'solved' && status !== 'closed')) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Verify ticket ownership before updating
        const ticket = await db.oneOrNone(
            'SELECT * FROM public.tickets WHERE id = $1 AND username = $2',
            [id, user.username]
        );

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found or unauthorized' }, { status: 404 });
        }

        await db.query(
            'UPDATE public.tickets SET status = $1, updated_at = NOW() WHERE id = $2',
            [status, id]
        );

        return NextResponse.json({ success: true, message: `Ticket marked as ${status}` });
    } catch (error: any) {
        console.error('PUT Ticket Error:', error);
        return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth(request);
        const { id } = await params;
        const { problem_description } = await request.json();

        if (!problem_description) {
            return NextResponse.json({ error: 'Description is required' }, { status: 400 });
        }

        // Verify ticket ownership
        const ticket = await db.oneOrNone(
            'SELECT * FROM public.tickets WHERE id = $1 AND username = $2',
            [id, user.username]
        );

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found or unauthorized' }, { status: 404 });
        }

        await db.query(
            'UPDATE public.tickets SET problem_description = $1, updated_at = NOW() WHERE id = $2',
            [problem_description, id]
        );

        return NextResponse.json({ success: true, message: 'Ticket updated successfully' });
    } catch (error: any) {
        console.error('PATCH Ticket Error:', error);
        return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
    }
}
