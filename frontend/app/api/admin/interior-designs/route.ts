import { Pool } from 'pg';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { existsSync, mkdirSync } from 'fs';

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Ratala_Architecture',
  password: 'SYSTEM',
  port: 5432,
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Ensure upload directory exists
const uploadDir = join(process.cwd(), 'public', 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

// Helper function to generate a random filename
function generateFileName(originalName: string): string {
  const ext = originalName.split('.').pop();
  const randomString = randomBytes(8).toString('hex');
  return `${randomString}.${ext}`;
}

// Handle OPTIONS request
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

// GET all images
export async function GET() {
  const client = await pool.connect();
  
  try {
    const result = await client.query(
      `SELECT id, image_description, image_path, created_at 
       FROM public."interior_image_upload" 
       ORDER BY created_at DESC`
    );
    
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch images',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } finally {
    client.release();
  }
}

// POST a new image
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const description = formData.get('description') as string | null;

    if (!file || !(file instanceof File) || !description) {
      return new Response(JSON.stringify({ 
        error: 'Image and description are required' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    // Generate a unique filename
    const fileName = generateFileName(file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Save to database
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO public."interior_image_upload" 
         (image_description, image_path) 
         VALUES ($1, $2) 
         RETURNING id`,
        [description, fileName]
      );
      
      return new Response(JSON.stringify({ 
        success: true, 
        id: result.rows[0].id 
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in image upload:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to upload image',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};