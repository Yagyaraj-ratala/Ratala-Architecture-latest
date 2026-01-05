import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { requireAuth } from '@/lib/auth';

const uploadDir = join(process.cwd(), 'public', 'uploads');

function generateFileName(originalName: string): string {
    const ext = originalName.split('.').pop();
    const randomString = randomBytes(8).toString('hex');
    return `${randomString}.${ext}`;
}

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth(request);
        const { id } = await props.params;

        const blog = await db.oneOrNone('SELECT * FROM public.blogs WHERE id = $1', [id]);
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth(request);
        const { id } = await props.params;

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const summary = formData.get('summary') as string;
        const content = formData.get('content') as string;
        const author = formData.get('author') as string;
        const category = formData.get('category') as string;
        const status = formData.get('status') as string;
        const slug = formData.get('slug') as string;
        const file = formData.get('image') as File | null;
        const deleteImage = formData.get('delete_image') === 'true';

        // Get current blog to handle image deletion
        const currentBlog = await db.oneOrNone('SELECT image_path FROM public.blogs WHERE id = $1', [id]);
        if (!currentBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        let imagePath = currentBlog.image_path;

        if (deleteImage && imagePath) {
            const fullPath = join(uploadDir, imagePath);
            if (existsSync(fullPath)) {
                await unlink(fullPath);
            }
            imagePath = null;
        }

        if (file && file instanceof File && file.size > 0) {
            // Delete old image if it exists
            if (imagePath) {
                const fullPath = join(uploadDir, imagePath);
                if (existsSync(fullPath)) {
                    await unlink(fullPath);
                }
            }

            const fileName = generateFileName(file.name);
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filePath = join(uploadDir, fileName);
            if (!existsSync(uploadDir)) {
                mkdirSync(uploadDir, { recursive: true });
            }
            await writeFile(filePath, buffer);
            imagePath = fileName;
        }

        const result = await db.query(
            `UPDATE public.blogs 
       SET title = $1, slug = $2, summary = $3, content = $4, author = $5, category = $6, status = $7, image_path = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
            [title, slug, summary || null, content, author || null, category || null, status, imagePath, id]
        );

        return NextResponse.json({ success: true, blog: result.rows[0] });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error updating blog:', error);
        return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth(request);
        const { id } = await props.params;

        // Get image path to delete file
        const blog = await db.oneOrNone('SELECT image_path FROM public.blogs WHERE id = $1', [id]);
        if (blog && blog.image_path) {
            const fullPath = join(uploadDir, blog.image_path);
            if (existsSync(fullPath)) {
                await unlink(fullPath);
            }
        }

        await db.query('DELETE FROM public.blogs WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error deleting blog:', error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}
