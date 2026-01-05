import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth(request);
        const { id } = await props.params;

        await db.query(`DELETE FROM public.quotation WHERE id = $1`, [id]);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === 'Unauthorized' || error.status === 401) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error deleting quotation:', error);
        return NextResponse.json({ error: 'Failed to delete quotation record' }, { status: 500 });
    }
}
