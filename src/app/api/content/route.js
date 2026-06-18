import { NextResponse } from 'next/server';
import { getContent, updateContent } from '@/lib/content';

const SESSION_TOKEN = process.env.ADMIN_TOKEN || 'chris_premium_secure_session_token_xyz123';

function checkAuth(request) {
  const c = request.cookies.get('admin_token');
  return c && c.value === SESSION_TOKEN;
}

export async function GET() {
  return NextResponse.json(getContent());
}

export async function POST(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }
  try {
    const partial = await request.json();
    const updated = updateContent(partial);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
