import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await props.params;

        const blog = await db.oneOrNone("SELECT * FROM public.blogs WHERE slug = $1 AND status = 'published'", [slug]);
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog);
    } catch (error: any) {
        console.error('Error fetching blog:', error);
        return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
    }
}
