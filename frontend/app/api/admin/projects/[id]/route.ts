import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { requireAuth } from '@/lib/auth';

const uploadDir = join(process.cwd(), 'public', 'uploads');

function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop();
  const randomString = randomBytes(8).toString('hex');
  return `${randomString}.${ext}`;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAuth(request);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

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
    const plotArea = formData.get('plot_area') as string;
    const plinthArea = formData.get('plinth_area') as string;
    const buildUpArea = formData.get('build_up_area') as string;
    const file = formData.get('image') as File | null;
    const deleteImage = formData.get('delete_image') === 'true';

    // Get multiple files
    const drawingPhotos = formData.getAll('drawing_photos') as File[];
    const projectPhotos = formData.getAll('project_photos') as File[];
    const projectVideos = formData.getAll('project_videos') as File[];

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
    const existingProject = await db.query('SELECT image_path, drawing_photos, project_photos, project_videos FROM projects WHERE id = $1', [id]);

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

    // Process drawing photos - keep existing or initialize empty array
    let drawingPhotoPaths: string[] = Array.isArray(existingProject.rows[0]?.drawing_photos)
      ? [...existingProject.rows[0].drawing_photos]
      : (existingProject.rows[0]?.drawing_photos ? JSON.parse(JSON.stringify(existingProject.rows[0].drawing_photos)) : []);

    for (const photo of drawingPhotos) {
      if (photo instanceof File && photo.size > 0) {
        const fileName = generateFileName(photo.name);
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        drawingPhotoPaths.push(fileName);
        // Limit to 4
        if (drawingPhotoPaths.length > 4) {
          drawingPhotoPaths = drawingPhotoPaths.slice(-4);
        }
      }
    }

    // Process project photos - keep existing or initialize empty array
    let projectPhotoPaths: string[] = Array.isArray(existingProject.rows[0]?.project_photos)
      ? [...existingProject.rows[0].project_photos]
      : (existingProject.rows[0]?.project_photos ? JSON.parse(JSON.stringify(existingProject.rows[0].project_photos)) : []);

    for (const photo of projectPhotos) {
      if (photo instanceof File && photo.size > 0) {
        const fileName = generateFileName(photo.name);
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        projectPhotoPaths.push(fileName);
        // Limit to 4
        if (projectPhotoPaths.length > 4) {
          projectPhotoPaths = projectPhotoPaths.slice(-4);
        }
      }
    }

    // Process project videos - keep existing or initialize empty array
    let projectVideoPaths: string[] = Array.isArray(existingProject.rows[0]?.project_videos)
      ? [...existingProject.rows[0].project_videos]
      : (existingProject.rows[0]?.project_videos ? JSON.parse(JSON.stringify(existingProject.rows[0].project_videos)) : []);

    for (const video of projectVideos) {
      if (video instanceof File && video.size > 0) {
        const fileName = generateFileName(video.name);
        const bytes = await video.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        projectVideoPaths.push(fileName);
        // Limit to 2
        if (projectVideoPaths.length > 2) {
          projectVideoPaths = projectVideoPaths.slice(-2);
        }
      }
    }

    const progressValue = status === 'ongoing' && progress ? parseInt(progress) : null;
    const plotAreaValue = plotArea ? parseFloat(plotArea) : null;
    const plinthAreaValue = plinthArea ? parseFloat(plinthArea) : null;
    const buildUpAreaValue = buildUpArea ? parseFloat(buildUpArea) : null;

    const result = await db.query(
      `UPDATE projects 
       SET status = $1, project_type = $2, title = $3, location = $4, description = $5, 
           image_path = $6, start_date = $7, completed_date = $8, progress = $9, 
           plot_area = $10, plinth_area = $11, build_up_area = $12, 
           drawing_photos = $13, project_photos = $14, project_videos = $15, updated_at = NOW()
       WHERE id = $16
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
        JSON.stringify(projectVideoPaths),
        id
      ]
    );

    return NextResponse.json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    await requireAuth(request);
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  let client;
  try {
    const { id } = await params;

    const existingProject = await db.query('SELECT image_path FROM projects WHERE id = $1', [id]);

    if (existingProject.rows[0]?.image_path) {
      try {
        await unlink(join(uploadDir, existingProject.rows[0].image_path));
      } catch (err) {
        console.error('Error deleting image file:', err);
      }
    }

    await db.query('DELETE FROM projects WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

