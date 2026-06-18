import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

const DEFAULT_DB = {
  inquiries: [],
  seo: {
    title: 'Swiss Auto Glow | High-End Autopflege & Veredelung',
    description: 'Bespoke Fahrzeugaufbereitung, tiefenreine Innenraumpflege und dauerhafter Unterboden- & Rostschutz für exklusive Automobile. Service ausschließlich auf Anfrage.',
    keywords: 'Car Detailing, Autoaufbereitung, Innenraumpflege, Unterbodenschutz, Rostschutz, Hohlraumversiegelung, Premium Autopflege, Christian Detailing',
  },
  visits: [],
};

function initDb() {
  try {
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
    }
  } catch { /* read-only filesystem (e.g. Vercel) — fall back to defaults */ }
}

export function readDb() {
  initDb();
  try {
    if (fs.existsSync(DB_FILE)) return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {}
  return { ...DEFAULT_DB };
}

export function writeDb(data) {
  initDb();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

/* ── Inquiries ─────────────────────────────────────────────── */
export function getInquiries() {
  return (readDb().inquiries || []);
}

export function addInquiry(inquiry) {
  const db = readDb();
  const newInquiry = {
    id: `inq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: 'pending',
    note: '',
    ...inquiry,
  };
  db.inquiries = db.inquiries || [];
  db.inquiries.unshift(newInquiry);
  writeDb(db);
  return newInquiry;
}

export function updateInquiryStatus(id, status) {
  const db = readDb();
  db.inquiries = db.inquiries || [];
  const idx = db.inquiries.findIndex(i => i.id === id);
  if (idx === -1) return null;
  db.inquiries[idx].status = status;
  writeDb(db);
  return db.inquiries[idx];
}

export function updateInquiryNote(id, note) {
  const db = readDb();
  db.inquiries = db.inquiries || [];
  const idx = db.inquiries.findIndex(i => i.id === id);
  if (idx === -1) return null;
  db.inquiries[idx].note = note;
  writeDb(db);
  return db.inquiries[idx];
}

export function deleteInquiry(id) {
  const db = readDb();
  db.inquiries = db.inquiries || [];
  const filtered = db.inquiries.filter(i => i.id !== id);
  if (filtered.length === db.inquiries.length) return false;
  db.inquiries = filtered;
  writeDb(db);
  return true;
}

/* ── SEO ───────────────────────────────────────────────────── */
export function getSeo() {
  return readDb().seo || {
    title: 'Swiss Auto Glow | High-End Autopflege',
    description: 'Bespoke Fahrzeugaufbereitung.',
    keywords: 'Detailing',
  };
}

export function updateSeo(seoData) {
  const db = readDb();
  db.seo = { ...db.seo, ...seoData };
  writeDb(db);
  return db.seo;
}

/* ── Stats ─────────────────────────────────────────────────── */
export function addVisit(visit) {
  const db = readDb();
  db.visits = db.visits || [];
  const newVisit = {
    id: `v_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    country: 'Unbekannt',
    countryCode: 'XX',
    region: '',
    city: '',
    duration: 0,
    ...visit,
  };
  db.visits.push(newVisit);
  if (db.visits.length > 10000) db.visits = db.visits.slice(-10000);
  writeDb(db);
  return newVisit;
}

export function updateVisitDuration(page, seconds) {
  const db = readDb();
  db.visits = db.visits || [];
  // Update the most recent visit for this page with duration
  const recents = db.visits.filter(v => v.page === page && v.duration === 0);
  if (recents.length > 0) {
    const last = recents[recents.length - 1];
    const idx = db.visits.findIndex(v => v.id === last.id);
    if (idx !== -1) db.visits[idx].duration = seconds;
    writeDb(db);
  }
}

export function getStats() {
  const db = readDb();
  return {
    totalViews: (db.visits || []).length,
    totalInquiries: (db.inquiries || []).length,
    pendingInquiries: (db.inquiries || []).filter(i => i.status === 'pending').length,
    visits: db.visits || [],
    inquiriesSummary: (db.inquiries || []).slice(0, 5),
  };
}
