import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SESSION_TOKEN = process.env.ADMIN_TOKEN || 'chris_premium_secure_session_token_xyz123';

export async function POST(request) {
  const cookie = request.cookies.get('admin_token');
  if (!cookie || cookie.value !== SESSION_TOKEN) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return NextResponse.json({ error: 'Keine Datei erhalten' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name || '.jpg') || '.jpg';
    const filename = `cms_${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ success: true, path: `/uploads/${filename}` });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
