import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await requireAuth(request);

        const settings = await db.oneOrNone(
            'SELECT * FROM public.site_settings WHERE id = 1'
        );

        return NextResponse.json(settings || {});
    } catch (error: any) {
        console.error('Settings GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await requireAuth(request);
        const data = await request.json();

        await db.none(
            `UPDATE public.site_settings 
             SET site_name = $1, 
                 contact_email = $2, 
                 contact_phone = $3, 
                 office_address = $4, 
                 facebook_url = $5, 
                 instagram_url = $6, 
                 linkedin_url = $7, 
                 meta_description = $8,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = 1`,
            [
                data.site_name,
                data.contact_email,
                data.contact_phone,
                data.office_address,
                data.facebook_url,
                data.instagram_url,
                data.linkedin_url,
                data.meta_description
            ]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Settings PUT Error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: error.message === 'Unauthorized' ? 401 : 500 });
    }
}
