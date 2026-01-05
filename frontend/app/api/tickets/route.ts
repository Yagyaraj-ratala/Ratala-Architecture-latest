import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        const { searchParams } = new URL(request.url);
        const service_name = searchParams.get('service_name');

        let queryStr = 'SELECT * FROM public.tickets WHERE username = $1';
        const params = [user.username];

        if (service_name) {
            queryStr += ' AND service_name = $2';
            params.push(service_name);
        }

        queryStr += ' ORDER BY created_at DESC';

        const result = await db.query(queryStr, params);
        return NextResponse.json(result.rows);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        // 1. Verify Authentication
        const user = await requireAuth(request);

        // 2. Parse Request Body
        const body = await request.json();
        const { service_name, problem_description } = body;


        // 3. Validation
        if (!service_name || !problem_description) {
            return NextResponse.json(
                { error: 'Missing required fields: service_name or problem_description' },
                { status: 400 }
            );
        }

        // 4. Save to Database
        // We use public.tickets to be absolutely sure about the table mapping
        const result = await db.query(
            `INSERT INTO public.tickets (username, service_name, problem_description, status, created_at, updated_at)
             VALUES ($1, $2, $3, 'open', NOW(), NOW())
             RETURNING id`,
            [user.username, service_name, problem_description]
        );

        const newTicket = result.rows[0];

        return NextResponse.json({
            success: true,
            ticketId: newTicket.id,
            message: 'Problem ticket raised successfully'
        });

    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error raising problem ticket:', error);
        return NextResponse.json(
            { error: 'Failed to raise problem ticket' },
            { status: 500 }
        );
    }
}
