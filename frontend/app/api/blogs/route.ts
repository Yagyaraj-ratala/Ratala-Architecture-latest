import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let query = "SELECT * FROM public.blogs WHERE status = 'published'";
        const params: any[] = [];

        if (category) {
            query += " AND category = $1";
            params.push(category);
        }

        query += " ORDER BY created_at DESC";

        const result = await db.query(query, params);
        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}
