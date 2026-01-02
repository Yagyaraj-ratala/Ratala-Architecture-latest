import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ratala_architecture',
  password: 'SYSTEM',
  port: 5432,
});

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`SELECT * FROM public.contact_us ORDER BY id DESC`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching contact_us rows:', error);
    return NextResponse.json({ error: 'Failed to fetch customer responses' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
