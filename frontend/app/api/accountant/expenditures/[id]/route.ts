import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// PUT - Update expenditure
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
        const { slno, itemDescription, qty, unit, rate, projectName, location, date } = body;

        // Validation
        if (!slno || !itemDescription || !qty || !unit || !rate || !projectName || !location || !date) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (qty <= 0 || rate < 0) {
            return NextResponse.json(
                { error: 'Quantity must be greater than 0 and rate must be non-negative' },
                { status: 400 }
            );
        }

        const total = parseFloat(qty) * parseFloat(rate);

        const result = await db.query(
            `UPDATE public.expenditures
             SET slno = $1, item_description = $2, qty = $3, unit = $4, 
                 rate = $5, total = $6, project_name = $7, location = $8, date = $9
             WHERE id = $10
             RETURNING id, slno, item_description, qty, unit, rate, total, 
                       project_name, location, date, created_at, updated_at`,
            [slno, itemDescription, qty, unit, rate, total, projectName, location, date, id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Expenditure not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        console.error('Error updating expenditure:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Handle unique constraint violation
        if (error.code === '23505') {
            return NextResponse.json(
                { error: 'SL No. already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update expenditure' },
            { status: 500 }
        );
    }
}

// DELETE - Delete expenditure
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
            'DELETE FROM public.expenditures WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Expenditure not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Expenditure deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting expenditure:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to delete expenditure' },
            { status: 500 }
        );
    }
}
