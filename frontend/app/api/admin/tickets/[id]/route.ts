import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth(request);
        const { id } = await params;
        const { status } = await request.json();

        if (!status || !['open', 'solved', 'closed'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const result = await db.query(
            'UPDATE public.tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, ticket: result.rows[0] });
    } catch (error: any) {
        console.error('Admin Ticket PATCH Error:', error);
        return NextResponse.json({ error: 'Failed to update ticket' }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth(request);
        const { id } = await params;

        const result = await db.query(
            'DELETE FROM public.tickets WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Ticket deleted successfully' });
    } catch (error: any) {
        console.error('Admin Ticket DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to delete ticket' }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
