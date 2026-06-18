import { NextResponse } from 'next/server';
import { updateVisitDuration } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { page, seconds } = body;
    if (page && seconds > 0) updateVisitDuration(page, seconds);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
