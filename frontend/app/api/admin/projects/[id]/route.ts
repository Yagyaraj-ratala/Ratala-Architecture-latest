import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ratala_architecture',
  password: 'SYSTEM',
  port: 5432,
});

const uploadDir = join(process.cwd(), 'public', 'uploads');

function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop();
  const randomString = randomBytes(8).toString('hex');
  return `${randomString}.${ext}`;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let client;
  try {
    const { id } = await params;
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
    const deleteImage = formData.get('delete_image') === 'true';

    client = await pool.connect();
    
    let imagePath = null;
    const existingProject = await client.query('SELECT image_path FROM projects WHERE id = $1', [id]);
    
    if (deleteImage && existingProject.rows[0]?.image_path) {
      try {
        await unlink(join(uploadDir, existingProject.rows[0].image_path));
      } catch (err) {
        console.error('Error deleting old image:', err);
      }
      imagePath = null;
    } else if (file && file instanceof File) {
      if (existingProject.rows[0]?.image_path) {
        try {
          await unlink(join(uploadDir, existingProject.rows[0].image_path));
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      const fileName = generateFileName(file.name);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      imagePath = fileName;
    } else {
      imagePath = existingProject.rows[0]?.image_path || null;
    }

    const progressValue = status === 'ongoing' && progress ? parseInt(progress) : null;
    
    const result = await client.query(
      `UPDATE projects 
       SET status = $1, project_type = $2, title = $3, location = $4, description = $5, 
           image_path = $6, start_date = $7, completed_date = $8, progress = $9, updated_at = NOW()
       WHERE id = $10
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
        progressValue,
        id
      ]
    );

    return NextResponse.json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let client;
  try {
    const { id } = await params;
    client = await pool.connect();
    
    const existingProject = await client.query('SELECT image_path FROM projects WHERE id = $1', [id]);
    
    if (existingProject.rows[0]?.image_path) {
      try {
        await unlink(join(uploadDir, existingProject.rows[0].image_path));
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    await client.query('DELETE FROM projects WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  } finally {
    if (client) client.release();
  }
}

