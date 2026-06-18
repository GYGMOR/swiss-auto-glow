import { NextResponse } from 'next/server';
import { getSeo, updateSeo } from '@/lib/db';

const SESSION_TOKEN = process.env.ADMIN_TOKEN || 'chris_premium_secure_session_token_xyz123';

// Helper to check authentication
function checkAuth(request) {
  const adminCookie = request.cookies.get('admin_token');
  return adminCookie && adminCookie.value === SESSION_TOKEN;
}

// GET: Fetch SEO settings (Public)
export async function GET() {
  try {
    const seo = getSeo();
    return NextResponse.json(seo);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Laden der SEO-Einstellungen' }, { status: 500 });
  }
}

// POST: Update SEO settings (Admin only)
export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { title, description, keywords } = body;
    
    if (!title || !description || !keywords) {
      return NextResponse.json({ error: 'Alle Felder mÃ¼ssen ausgefÃ¼llt werden.' }, { status: 400 });
    }
    
    const updatedSeo = updateSeo({ title, description, keywords });
    return NextResponse.json({ success: true, seo: updatedSeo });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Speichern der SEO-Einstellungen' }, { status: 500 });
  }
}
