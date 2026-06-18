import { NextResponse } from 'next/server';
import { getInquiries, addInquiry, updateInquiryStatus, updateInquiryNote, deleteInquiry } from '@/lib/db';

const SESSION_TOKEN = process.env.ADMIN_TOKEN || 'chris_premium_secure_session_token_xyz123';

function checkAuth(request) {
  const c = request.cookies.get('admin_token');
  return c && c.value === SESSION_TOKEN;
}

export async function GET(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  try {
    return NextResponse.json(getInquiries());
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, services } = body;
    if (!name || (!email && !phone) || !services || services.length === 0) {
      return NextResponse.json({ error: 'Bitte fÃ¼llen Sie alle erforderlichen Felder aus.' }, { status: 400 });
    }
    const newInquiry = addInquiry(body);
    return NextResponse.json({ success: true, inquiry: newInquiry });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Senden' }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  try {
    const body = await request.json();
    const { id, status, note } = body;
    if (!id) return NextResponse.json({ error: 'Fehlende ID' }, { status: 400 });

    let updated;
    if (status !== undefined) updated = updateInquiryStatus(id, status);
    if (note !== undefined) updated = updateInquiryNote(id, note);
    if (!updated) return NextResponse.json({ error: 'Anfrage nicht gefunden' }, { status: 404 });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!checkAuth(request)) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Fehlende ID' }, { status: 400 });
    const ok = deleteInquiry(id);
    if (!ok) return NextResponse.json({ error: 'Anfrage nicht gefunden' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Fehler beim LÃ¶schen' }, { status: 500 });
  }
}
