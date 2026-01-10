import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET - Fetch all expenditures
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth(request);

        // Only accountants can access this endpoint
        if (user.role !== 'accountant') {
            return NextResponse.json(
                { error: 'Unauthorized. Accountant role required.' },
                { status: 403 }
            );
        }

        const result = await db.query(
            `SELECT id, slno, item_description, qty, unit, rate, total, 
                    project_name, location, date, created_at, updated_at
             FROM public.expenditures
             ORDER BY date DESC, created_at DESC`
        );

        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error('Error fetching expenditures:', error);
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json(
            { error: 'Failed to fetch expenditures' },
            { status: 500 }
        );
    }
}

// POST - Create new expenditure
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth(request);

        // Only accountants can access this endpoint
        if (user.role !== 'accountant') {
            return NextResponse.json(
                { error: 'Unauthorized. Accountant role required.' },
                { status: 403 }
            );
        }

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
            `INSERT INTO public.expenditures 
             (slno, item_description, qty, unit, rate, total, project_name, location, date, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING id, slno, item_description, qty, unit, rate, total, 
                       project_name, location, date, created_at, updated_at`,
            [slno, itemDescription, qty, unit, rate, total, projectName, location, date, user.userId]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error: any) {
        console.error('Error creating expenditure:', error);

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
            { error: 'Failed to create expenditure' },
            { status: 500 }
        );
    }
}
