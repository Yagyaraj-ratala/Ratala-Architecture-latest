// app/api/admin/interior-designs/delete/route.ts
import { unlink } from 'fs/promises';
import { join } from 'path';
import { Pool } from 'pg';
import { NextRequest } from 'next/server';

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ratala_architecture',
  password: 'SYSTEM',
  port: 5432,
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const uploadDir = join(process.cwd(), 'public', 'uploads');

export async function DELETE(request: NextRequest) {
  try {
    // Get ID from query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    console.log('DELETE request received with ID:', id);

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Image ID is required' 
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid image ID' 
      }), { 
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    const client = await pool.connect();
    try {
      // Get the image path first
      const result = await client.query(
        'SELECT image_path FROM public."interior_image_upload" WHERE id = $1',
        [numericId]
      );

      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ 
          success: false,
          error: 'Image not found' 
        }), { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      const imagePath = result.rows[0].image_path;
      const filePath = join(uploadDir, imagePath);

      // Delete the file
      try {
        await unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
        // Continue with database deletion even if file deletion fails
      }

      // Delete from database
      await client.query(
        'DELETE FROM public."interior_image_upload" WHERE id = $1', 
        [numericId]
      );

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Image deleted successfully'
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
    console.error('Error in DELETE handler:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Failed to delete image',
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