import { NextResponse } from 'next/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@detailing-christian.ch';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChrisDetailing2026!';
const SESSION_TOKEN = process.env.ADMIN_TOKEN || 'chris_premium_secure_session_token_xyz123';

export async function GET(request) {
  const adminCookie = request.cookies.get('admin_token');
  if (adminCookie && adminCookie.value === SESSION_TOKEN) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (
      email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'admin_token',
        value: SESSION_TOKEN,
        httpOnly: true,
        path: '/',
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'UngÃ¼ltige Anmeldedaten' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Serverfehler' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({ name: 'admin_token', value: '', httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
