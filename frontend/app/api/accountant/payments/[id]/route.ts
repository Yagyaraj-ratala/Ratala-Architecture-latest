import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// PUT - Update payment
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request);

        // Only accountants can access this endpoint
        if (user.role !== 'accountant') {
            return NextResponse.json(
                { error: 'Unauthorized. Accountant role required.' },
                { status: 403 }
            );
        }

        const id = params.id;
        const body = await request.json();
        const { type, labourName, siteName, payAmount, date, description } = body;

        // Validation
        if (!type || !labourName || !siteName || !payAmount || !date) {
            return NextResponse.json(
                { error: 'Type, labour name, site name, amount, and date are required' },
                { status: 400 }
            );
        }

        if (!['payment', 'receipt'].includes(type)) {
            return NextResponse.json(
                { error: 'Type must be either "payment" or "receipt"' },
                { status: 400 }
            );
        }

        if (payAmount <= 0) {
            return NextResponse.json(
                { error: 'Amount must be greater than 0' },
                { status: 400 }
            );
        }

        const result = await db.query(
            `UPDATE public.payments
             SET type = $1, labour_name = $2, site_name = $3, 
                 pay_amount = $4, date = $5, description = $6
             WHERE id = $7
             RETURNING id, type, labour_name, site_name, pay_amount, date, description, created_at, updated_at`,
            [type, labourName, siteName, payAmount, date, description || null, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Payment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        console.error('Error updating payment:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to update payment' },
            { status: 500 }
        );
    }
}

// DELETE - Delete payment
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth(request);

        // Only accountants can access this endpoint
        if (user.role !== 'accountant') {
            return NextResponse.json(
                { error: 'Unauthorized. Accountant role required.' },
                { status: 403 }
            );
        }

        const id = params.id;

        const result = await db.query(
            'DELETE FROM public.payments WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Payment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Payment deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting payment:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to delete payment' },
            { status: 500 }
        );
    }
}
