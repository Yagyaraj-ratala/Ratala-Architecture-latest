import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { existsSync, mkdirSync } from 'fs';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ratala_architecture',
  password: 'SYSTEM',
  port: 5432,
});

const uploadDir = join(process.cwd(), 'public', 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop();
  const randomString = randomBytes(8).toString('hex');
  return `${randomString}.${ext}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const type = searchParams.get('type');

  let client;
  try {
    client = await pool.connect();
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

    const result = await client.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

export async function POST(request: Request) {
  let client;
  try {
    const formData = await request.formData();
    const status = formData.get('status') as string;
    const projectType = formData.get('project_type') as string;
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const startDate = formData.get('start_date') as string;
    const completedDate = formData.get('completed_date') as string;
    const progress = formData.get('progress') as string;
    const file = formData.get('image') as File | null;

    if (!status || !projectType || !title || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imagePath = null;
    if (file && file instanceof File) {
      const fileName = generateFileName(file.name);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imagePath = fileName;
    }

    client = await pool.connect();
    const progressValue = status === 'ongoing' && progress ? parseInt(progress) : null;
    
    const result = await client.query(
      `INSERT INTO projects (status, project_type, title, location, description, image_path, start_date, completed_date, progress, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING *`,
      [
        status,
        projectType,
        title,
        location,
        description || null,
        imagePath,
        startDate || null,
        completedDate || null,
        progressValue
      ]
    );

    return NextResponse.json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}


