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

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
}

export async function GET(request: NextRequest) {
    try {
        await requireAuth(request);

        const result = await db.query('SELECT * FROM public.blogs ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAuth(request);

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const summary = formData.get('summary') as string;
        const content = formData.get('content') as string;
        const author = formData.get('author') as string;
        const category = formData.get('category') as string;
        const status = (formData.get('status') as string) || 'published';
        const file = formData.get('image') as File | null;

        if (!title || !content) {
            return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
        }

        let slug = formData.get('slug') as string;
        if (!slug) {
            slug = slugify(title);
        }

        // Check if slug exists
        const existingBlog = await db.oneOrNone('SELECT id FROM public.blogs WHERE slug = $1', [slug]);
        if (existingBlog) {
            slug = `${slug}-${Date.now()}`;
        }

        let imagePath = null;
        if (file && file instanceof File && file.size > 0) {
            const fileName = generateFileName(file.name);
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filePath = join(uploadDir, fileName);
            await writeFile(filePath, buffer);
            imagePath = fileName;
        }

        const result = await db.query(
            `INSERT INTO public.blogs (title, slug, summary, content, author, category, status, image_path, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
            [title, slug, summary || null, content, author || null, category || null, status, imagePath]
        );

        return NextResponse.json({ success: true, blog: result.rows[0] });
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Error creating blog:', error);
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}
