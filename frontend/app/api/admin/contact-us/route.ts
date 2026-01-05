import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth(request);

    const result = await db.query(`SELECT * FROM public.contact ORDER BY id DESC`);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching contact rows:', error);
    return NextResponse.json({ error: 'Failed to fetch contact reports' }, { status: 500 });
  }
}
