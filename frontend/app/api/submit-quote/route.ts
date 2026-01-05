import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await db.query(
      `INSERT INTO public.quotation 
      (full_name, email, phone, project_type, estimated_budgets, project_details, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
      RETURNING id, created_at`,
      [
        formData.name,
        formData.email,
        formData.phone,
        formData.projectType,
        formData.budget,
        formData.message || null
      ]
    );

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      created_at: result.rows[0].created_at
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote' },
      { status: 500 }
    );
  }
}
