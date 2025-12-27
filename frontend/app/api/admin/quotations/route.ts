import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Ratala_Architecture',
  password: 'SYSTEM',
  port: 5432,
});

export async function GET() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`SELECT * FROM public."CUSTOMER_QUOTATION" ORDER BY id DESC`);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}
