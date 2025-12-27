import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Ratala_Architecture',
  password: 'SYSTEM',
  port: 5432,
});

export async function POST(request: Request) {
  let client;
  try {
    const body = await request.json();

    if (!body.full_name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    client = await pool.connect();
    const result = await client.query(
      `INSERT INTO public.contact_us (full_name, email, phone, subject, message, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, created_at`,
      [body.full_name, body.email, body.phone || null, body.subject || null, body.message || null]
    );

    return NextResponse.json({ success: true, id: result.rows[0].id, created_at: result.rows[0].created_at });
  } catch (error) {
    console.error('Error inserting contact_us row:', error);
    return NextResponse.json({ error: 'Failed to submit contact' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
