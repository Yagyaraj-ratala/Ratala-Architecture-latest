import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    try {
        let query = 'SELECT * FROM projects ORDER BY created_at DESC';
        const params: any[] = [];

        if (status || type) {
            const conditions: string[] = [];
            if (status) {
                conditions.push(`status = $${params.length + 1}`);
                params.push(status);
            }
            if (type) {
                conditions.push(`project_type = $${params.length + 1}`);
                params.push(type);
            }
            query = `SELECT * FROM projects WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`;
        }

        const result = await db.query(query, params);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}
