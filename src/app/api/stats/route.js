import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { addVisit, getStats } from '@/lib/db';

const SESSION_TOKEN = process.env.ADMIN_TOKEN || 'chris_premium_secure_session_token_xyz123';

function checkAuth(request) {
  const c = request.cookies.get('admin_token');
  return c && c.value === SESSION_TOKEN;
}

async function getGeoData(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168') || ip.startsWith('10.')) {
    return { country: 'Lokal', countryCode: 'CH', region: 'Entwicklung', city: 'Localhost' };
  }
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'ChristianDetailing/1.0' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const d = await res.json();
    if (d.error) return null;
    return {
      country: d.country_name || 'Unbekannt',
      countryCode: d.country_code || 'XX',
      region: d.region || '',
      city: d.city || '',
    };
  } catch {
    return null;
  }
}

/* â”€â”€ GET: Dashboard data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export async function GET(request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';

    const raw = getStats();
    let visits = raw.visits;

    // Time filter
    if (period !== 'all') {
      const now = Date.now();
      const ms = { today: 86400000, '7d': 7 * 86400000, '30d': 30 * 86400000 }[period];
      if (ms) visits = visits.filter(v => now - new Date(v.timestamp).getTime() < ms);
    }

    // Active in last 5 minutes
    const fiveMin = Date.now() - 5 * 60 * 1000;
    const activeNow = visits.filter(v => new Date(v.timestamp).getTime() > fiveMin).length;

    const pageViews = {};
    const referrers = {};
    const devices = { desktop: 0, tablet: 0, mobile: 0 };
    const browsers = {};
    const dailyVisits = {};
    const countries = {};
    const regions = {};
    const uniqueIps = new Set();
    let totalDuration = 0;
    let durationCount = 0;

    visits.forEach(v => {
      if (v.ipHash) uniqueIps.add(v.ipHash);

      pageViews[v.page || '/'] = (pageViews[v.page || '/'] || 0) + 1;
      referrers[v.referrer || 'Direkt'] = (referrers[v.referrer || 'Direkt'] || 0) + 1;

      const dev = v.device || 'desktop';
      if (devices[dev] !== undefined) devices[dev]++;
      else devices.desktop++;

      browsers[v.browser || 'Andere'] = (browsers[v.browser || 'Andere'] || 0) + 1;

      if (v.timestamp) {
        const day = v.timestamp.split('T')[0];
        dailyVisits[day] = (dailyVisits[day] || 0) + 1;
      }

      const cKey = `${v.countryCode || 'XX'}|${v.country || 'Unbekannt'}`;
      countries[cKey] = (countries[cKey] || 0) + 1;

      if (v.city && v.region) {
        const rKey = `${v.city}, ${v.region}`;
        regions[rKey] = (regions[rKey] || 0) + 1;
      }

      if (v.duration > 0) {
        totalDuration += v.duration;
        durationCount++;
      }
    });

    // Bounce rate: visits with duration < 10 seconds
    const bounces = visits.filter(v => v.duration > 0 && v.duration < 10).length;
    const bounceRate = durationCount > 0 ? Math.round((bounces / durationCount) * 100) : null;
    const avgDuration = durationCount > 0 ? Math.round(totalDuration / durationCount) : null;

    return NextResponse.json({
      totalViews: visits.length,
      uniqueVisitors: uniqueIps.size,
      totalInquiries: raw.totalInquiries,
      pendingInquiries: raw.pendingInquiries,
      activeNow,
      bounceRate,
      avgDuration,
      devices,
      dailyVisits: Object.keys(dailyVisits).sort().map(d => ({ date: d, count: dailyVisits[d] })),
      pageViews: Object.entries(pageViews).map(([page, count]) => ({ page, count })).sort((a, b) => b.count - a.count),
      referrers: Object.entries(referrers).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      browsers: Object.entries(browsers).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      countries: Object.entries(countries).map(([k, count]) => {
        const [countryCode, country] = k.split('|');
        return { country, countryCode, count };
      }).sort((a, b) => b.count - a.count),
      regions: Object.entries(regions).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Stats GET error:', err);
    return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 });
  }
}

/* â”€â”€ POST: Record visit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export async function POST(request) {
  try {
    const body = await request.json();
    const { page, referrer, browser, device } = body;

    const fwd = request.headers.get('x-forwarded-for');
    const ip = (fwd ? fwd.split(',')[0].trim() : null)
      || request.headers.get('x-real-ip')
      || '127.0.0.1';

    const today = new Date().toISOString().split('T')[0];
    const ipHash = crypto.createHash('sha256').update(ip + today + 'chris_detailing_salt_99').digest('hex');

    const geo = await getGeoData(ip);

    addVisit({
      page: page || '/',
      referrer: referrer || 'Direkt',
      browser: browser || 'Unbekannt',
      device: device || 'desktop',
      ipHash,
      country: geo?.country || 'Unbekannt',
      countryCode: geo?.countryCode || 'XX',
      region: geo?.region || '',
      city: geo?.city || '',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
