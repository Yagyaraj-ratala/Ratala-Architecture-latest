import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ratala_architecture',
  password: 'SYSTEM',
  port: 5432,
});

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

    const client = await pool.connect();
    
    try {
      // Convert budget range to string (e.g., "5-10 Lakhs")
      const budgetValue = formData.budget;
      
      const result = await client.query(
        `INSERT INTO public."CUSTOMER_QUOTATION" 
        (full_name, email, phone, project_type, estimated_budgets, project_details, created_at) 
        VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
        RETURNING id, created_at`,
        [
          formData.name,
          formData.email,
          formData.phone,
          formData.projectType,
          budgetValue,
          formData.message || null
        ]
      );

      return NextResponse.json({ 
        success: true, 
        id: result.rows[0].id,
        created_at: result.rows[0].created_at
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote' },
      { status: 500 }
    );
  }
}
