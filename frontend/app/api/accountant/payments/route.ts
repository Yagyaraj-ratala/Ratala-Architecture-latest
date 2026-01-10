import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET - Fetch all payments
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
            `SELECT id, type, labour_name, site_name, pay_amount, date, description, created_at, updated_at
             FROM public.payments
             ORDER BY date DESC, created_at DESC`
        );

        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error('Error fetching payments:', error);
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json(
            { error: 'Failed to fetch payments' },
            { status: 500 }
        );
    }
}

// POST - Create new payment
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
            `INSERT INTO public.payments 
             (type, labour_name, site_name, pay_amount, date, description, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, type, labour_name, site_name, pay_amount, date, description, created_at, updated_at`,
            [type, labourName, siteName, payAmount, date, description || null, user.userId]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error: any) {
        console.error('Error creating payment:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to create payment' },
            { status: 500 }
        );
    }
}
