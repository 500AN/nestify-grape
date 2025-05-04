// app/api/save-html/route.ts (for App Router)
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Log the request for debugging
    console.log('Received save-html request');
    
    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed successfully');
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    const { html, filename } = body;
    if (!html || !filename) {
      console.error('Missing required fields:', { hasHtml: !!html, hasFilename: !!filename });
      return NextResponse.json(
        { error: 'Missing required fields: html and filename' },
        { status: 400 }
      );
    }
    
    // Ensure filename is safe
    const safeFilename = filename.replace(/[^a-z0-9.-]/gi, '_');
    
    // Ensure directory exists
    const exportDir = path.join(process.cwd(), 'public', 'exports');
    console.log('Export directory:', exportDir);
    
    try {
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
        console.log('Created exports directory');
      }
    } catch (e) {
      console.error('Failed to create directory:', e);
      return NextResponse.json(
        { error: 'Failed to create exports directory' },
        { status: 500 }
      );
    }
    
    // Write file
    const filePath = path.join(exportDir, safeFilename);
    console.log('Writing file to:', filePath);
    
    try {
      fs.writeFileSync(filePath, html);
      console.log('File written successfully');
    } catch (e) {
      console.error('Failed to write file:', e);
      return NextResponse.json(
        { error: 'Failed to write file: ' + (e instanceof Error ? e.message : String(e)) },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      path: `/exports/${safeFilename}` 
    });
  } catch (error) {
    console.error('Unexpected error in save-html API:', error);
    return NextResponse.json(
      { error: 'Server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}