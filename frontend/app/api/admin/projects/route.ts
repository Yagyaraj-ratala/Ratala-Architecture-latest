import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { requireAuth } from '@/lib/auth';

const uploadDir = join(process.cwd(), 'public', 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop();
  const randomString = randomBytes(8).toString('hex');
  return `${randomString}.${ext}`;
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

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
    if (error instanceof Error && (error.message === 'Unauthorized' || (error as any).status === 401)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth(request);

    const formData = await request.formData();
    const status = formData.get('status') as string;
    const projectType = formData.get('project_type') as string;
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    const startDate = formData.get('start_date') as string;
    const completedDate = formData.get('completed_date') as string;
    const progress = formData.get('progress') as string;
    const plotArea = formData.get('plot_area') as string;
    const plinthArea = formData.get('plinth_area') as string;
    const buildUpArea = formData.get('build_up_area') as string;
    const file = formData.get('image') as File | null;

    // Get multiple files
    const drawingPhotos = formData.getAll('drawing_photos') as File[];
    const projectPhotos = formData.getAll('project_photos') as File[];
    const projectVideos = formData.getAll('project_videos') as File[];

    if (!status || !projectType || !title || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file limits
    if (drawingPhotos.length > 4) {
      return NextResponse.json({ error: 'Maximum 4 drawing photos allowed' }, { status: 400 });
    }
    if (projectPhotos.length > 4) {
      return NextResponse.json({ error: 'Maximum 4 project photos allowed' }, { status: 400 });
    }
    if (projectVideos.length > 2) {
      return NextResponse.json({ error: 'Maximum 2 project videos allowed' }, { status: 400 });
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

    // Process drawing photos (max 4)
    const drawingPhotoPaths: string[] = [];
    for (const photo of drawingPhotos) {
      if (photo instanceof File && photo.size > 0) {
        const fileName = generateFileName(photo.name);
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        drawingPhotoPaths.push(fileName);
      }
    }

    // Process project photos (max 4)
    const projectPhotoPaths: string[] = [];
    for (const photo of projectPhotos) {
      if (photo instanceof File && photo.size > 0) {
        const fileName = generateFileName(photo.name);
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        projectPhotoPaths.push(fileName);
      }
    }

    // Process project videos (max 2)
    const projectVideoPaths: string[] = [];
    for (const video of projectVideos) {
      if (video instanceof File && video.size > 0) {
        const fileName = generateFileName(video.name);
        const bytes = await video.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        projectVideoPaths.push(fileName);
      }
    }

    const progressValue = status === 'ongoing' && progress ? parseInt(progress) : null;
    const plotAreaValue = plotArea ? parseFloat(plotArea) : null;
    const plinthAreaValue = plinthArea ? parseFloat(plinthArea) : null;
    const buildUpAreaValue = buildUpArea ? parseFloat(buildUpArea) : null;

    const result = await db.query(
      `INSERT INTO projects (status, project_type, title, location, description, image_path, start_date, completed_date, progress, plot_area, plinth_area, build_up_area, drawing_photos, project_photos, project_videos, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
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
        plotAreaValue,
        plinthAreaValue,
        buildUpAreaValue,
        JSON.stringify(drawingPhotoPaths),
        JSON.stringify(projectPhotoPaths),
        JSON.stringify(projectVideoPaths)
      ]
    );

    return NextResponse.json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}


