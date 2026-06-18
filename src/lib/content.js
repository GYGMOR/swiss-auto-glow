import fs from 'fs';
import path from 'path';
import { DEFAULT_CONTENT } from '@/lib/content-defaults';
export { DEFAULT_CONTENT };

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'content.json');

function deepMerge(base, override) {
  const result = { ...base };
  for (const k of Object.keys(override || {})) {
    if (Array.isArray(override[k])) result[k] = override[k];
    else if (override[k] && typeof override[k] === 'object' && base[k] && typeof base[k] === 'object')
      result[k] = deepMerge(base[k], override[k]);
    else result[k] = override[k];
  }
  return result;
}

export function getContent() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE)) {
      fs.writeFileSync(FILE, JSON.stringify(DEFAULT_CONTENT, null, 2), 'utf-8');
      return DEFAULT_CONTENT;
    }
    return deepMerge(DEFAULT_CONTENT, JSON.parse(fs.readFileSync(FILE, 'utf-8')));
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function updateContent(partial) {
  try {
    const updated = deepMerge(getContent(), partial);
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch {
    return deepMerge(DEFAULT_CONTENT, partial);
  }
}
