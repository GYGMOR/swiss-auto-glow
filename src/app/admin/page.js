'use client';

import { useState, useEffect, useCallback } from 'react';

/* ─── SVG Icons ──────────────────────────────────────────────────── */
const I = {
  Chart:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  Globe:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Inbox:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  Search:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Cog:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Eye:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  User:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Clock:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Pin:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Star:    () => <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Warning: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Refresh: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  LogOut:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Lock:    () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  At:      () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>,
  Download:() => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Delete:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Bounce:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 7l-10 10"/><path d="M8 7h9v9"/></svg>,
  Bell:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  File:    () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Image:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Upload:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
};

/* ─── Helpers ────────────────────────────────────────────────────── */
function flagEmoji(code) {
  if (!code || code === 'XX') return '🌐';
  return code.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
}
function fmtDuration(sec) {
  if (!sec && sec !== 0) return '—';
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}
function fmtTime(iso) {
  return new Date(iso).toLocaleString('de-CH', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

/* ─── Line Chart (Cloudflare style) ─────────────────────────────── */
function LineChart({ data }) {
  if (!data || data.length === 0) return <p className="empty-hint">Noch keine Daten erfasst — besuche die Website um Tracking zu starten.</p>;
  const safeData = data.length === 1 ? [data[0], data[0]] : data;
  const max = Math.max(...safeData.map(d => d.count), 1);
  const W = 800, H = 100, pad = 4;
  const pts = safeData.map((d, i) => {
    const x = pad + (i / (safeData.length - 1)) * (W - pad * 2);
    const y = H - pad - ((d.count / max) * (H - pad * 2));
    return [x, y];
  });
  const polyline = pts.map(p => p.join(',')).join(' ');
  const fill = `0,${H} ${polyline} ${W},${H}`;
  const displayData = safeData;
  const color = '#58a6ff';
  return (
    <div className="cf-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="cf-svg">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1={0} y1={H * f} x2={W} y2={H * f} stroke="#1e2530" strokeWidth="1"/>
        ))}
        <polygon points={fill} fill="url(#lg)"/>
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color} opacity="0.75"/>)}
      </svg>
      <div className="cf-labels">
        {displayData.filter((_, i) => i === 0 || i === displayData.length - 1 || (displayData.length > 3 && i === Math.floor(displayData.length / 2))).map((d, i) => (
          <span key={i}>{d.date?.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}

/* ─── Donut Chart ────────────────────────────────────────────────── */
function DonutChart({ data, colors, size = 130 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 48, circ = 2 * Math.PI * r;
  if (!total) {
    return (
      <div className="donut-wrap">
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1e2530" strokeWidth="14"/>
          <text x="60" y="60" textAnchor="middle" dominantBaseline="middle" fill="#3d444d" fontSize="8">Keine Daten</text>
        </svg>
        <ul className="donut-legend">
          {data.map((d, i) => (
            <li key={i}><span className="d-dot" style={{ background: colors[i % colors.length] }}/><span className="d-lbl">{d.label}</span><span className="d-val">0%</span></li>
          ))}
        </ul>
      </div>
    );
  }
  let offset = 0;
  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#1e2530" strokeWidth="14"/>
        {data.map((d, i) => {
          const dash = (d.value / total) * circ;
          const seg = (
            <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={colors[i % colors.length]}
              strokeWidth="14" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}/>
          );
          offset += dash;
          return seg;
        })}
        <text x="60" y="55" textAnchor="middle" fill="#e6edf3" fontSize="13" fontWeight="700">{total}</text>
        <text x="60" y="69" textAnchor="middle" fill="#768390" fontSize="7.5">gesamt</text>
      </svg>
      <ul className="donut-legend">
        {data.map((d, i) => (
          <li key={i}>
            <span className="d-dot" style={{ background: colors[i % colors.length] }}/>
            <span className="d-lbl">{d.label}</span>
            <span className="d-val">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Horizontal Bar ─────────────────────────────────────────────── */
function HBar({ label, count, max, color }) {
  const pct = max ? Math.round((count / max) * 100) : 0;
  return (
    <div className="hbar">
      <span className="hbar-lbl">{label}</span>
      <div className="hbar-track"><div className="hbar-fill" style={{ width: `${pct}%`, background: color }}/></div>
      <span className="hbar-cnt">{count}</span>
    </div>
  );
}

/* ─── CMS Sub-components ──────────────────────────────────────────── */
function CField({ label, value, onChange, rows, hint }) {
  return (
    <div className="cms-field">
      <label>{label}{hint && <span className="cms-hint"> — {hint}</span>}</label>
      {rows
        ? <textarea rows={rows} value={value||''} onChange={e=>onChange(e.target.value)}/>
        : <input type="text" value={value||''} onChange={e=>onChange(e.target.value)}/>
      }
    </div>
  );
}
function CImgPicker({ label, value, onChange, onUpload }) {
  return (
    <div className="cms-field">
      <label>{label}</label>
      <div className="img-picker">
        {value && <img src={value} alt="" className="img-preview"/>}
        <label className="btn-upload">
          <I.Upload/> Bild hochladen
          <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>{
            if(e.target.files[0]) onUpload(e.target.files[0], p=>onChange(p));
          }}/>
        </label>
        {value && <span className="img-path">{value}</span>}
      </div>
    </div>
  );
}
function CmsHeroSection({ initialData, cmsSaving, onSave, onUpload }) {
  const [d, setD] = useState({...initialData});
  return (
    <div className="cms-form">
      <div className="cms-grid-2">
        <CField label="Eyebrow" value={d.eyebrow} onChange={v=>setD(p=>({...p,eyebrow:v}))}/>
        <CField label="Badge Text" value={d.badge_val} onChange={v=>setD(p=>({...p,badge_val:v}))}/>
      </div>
      <CField label="H1 Zeile 1" value={d.h1_1} onChange={v=>setD(p=>({...p,h1_1:v}))}/>
      <CField label="H1 Zeile 2 (AUTOMOBILS wird gold)" value={d.h1_2} onChange={v=>setD(p=>({...p,h1_2:v}))}/>
      <CField label="H1 Zeile 3" value={d.h1_3} onChange={v=>setD(p=>({...p,h1_3:v}))}/>
      <CField label="Untertitel" value={d.subtitle} onChange={v=>setD(p=>({...p,subtitle:v}))} rows={2}/>
      <div className="cms-grid-2">
        <CField label="Button 1 Text" value={d.btn1} onChange={v=>setD(p=>({...p,btn1:v}))}/>
        <CField label="Button 1 Link" value={d.btn1_href} onChange={v=>setD(p=>({...p,btn1_href:v}))}/>
        <CField label="Button 2 Text" value={d.btn2} onChange={v=>setD(p=>({...p,btn2:v}))}/>
        <CField label="Button 2 Link" value={d.btn2_href} onChange={v=>setD(p=>({...p,btn2_href:v}))}/>
      </div>
      <span className="field-label">Trust Pills</span>
      <div className="cms-grid-3">
        {(d.trust||[]).map((t,i)=><CField key={i} label={`Pill ${i+1}`} value={t} onChange={v=>{const a=[...d.trust];a[i]=v;setD(p=>({...p,trust:a}));}}/>)}
      </div>
      <span className="field-label">Statistiken</span>
      {(d.stats||[]).map((s,i)=>(
        <div key={i} className="cms-grid-3">
          <CField label={`Zahl ${i+1}`} value={String(s.val)} onChange={v=>{const a=[...d.stats];a[i]={...a[i],val:isNaN(v)?v:Number(v)};setD(p=>({...p,stats:a}));}}/>
          <CField label="Suffix" value={s.suffix} onChange={v=>{const a=[...d.stats];a[i]={...a[i],suffix:v};setD(p=>({...p,stats:a}));}}/>
          <CField label="Label" value={s.label} onChange={v=>{const a=[...d.stats];a[i]={...a[i],label:v};setD(p=>({...p,stats:a}));}}/>
        </div>
      ))}
      <CImgPicker label="Hero Bild" value={d.image} onChange={v=>setD(p=>({...p,image:v}))} onUpload={onUpload}/>
      <button className="btn-save" disabled={cmsSaving} onClick={()=>onSave(d)}><I.Check/>{cmsSaving?'Speichert…':'Speichern'}</button>
    </div>
  );
}
function CmsPhilSection({ initialData, cmsSaving, onSave }) {
  const [d, setD] = useState({...initialData});
  return (
    <div className="cms-form">
      <CField label="Zitat" value={d.quote} onChange={v=>setD(p=>({...p,quote:v}))} rows={3}/>
      <CField label="Fliesstext" value={d.body} onChange={v=>setD(p=>({...p,body:v}))} rows={4}/>
      <CField label="Signatur" value={d.signature} onChange={v=>setD(p=>({...p,signature:v}))}/>
      <span className="field-label">Statistiken</span>
      {(d.stats||[]).map((s,i)=>(
        <div key={i} className="cms-grid-3">
          <CField label={`Zahl ${i+1}`} value={String(s.n)} onChange={v=>{const a=[...d.stats];a[i]={...a[i],n:isNaN(v)?v:Number(v)};setD(p=>({...p,stats:a}));}}/>
          <CField label="Suffix" value={s.s} onChange={v=>{const a=[...d.stats];a[i]={...a[i],s:v};setD(p=>({...p,stats:a}));}}/>
          <CField label="Label" value={s.label} onChange={v=>{const a=[...d.stats];a[i]={...a[i],label:v};setD(p=>({...p,stats:a}));}}/>
        </div>
      ))}
      <button className="btn-save" disabled={cmsSaving} onClick={()=>onSave(d)}><I.Check/>{cmsSaving?'Speichert…':'Speichern'}</button>
    </div>
  );
}
function CmsServicesSection({ initialData, cmsSaving, onSave, onUpload }) {
  const clone = d => ({...d, pillars: d.pillars.map(p=>({...p, features:[...p.features]}))});
  const [d, setD] = useState(clone(initialData));
  return (
    <div className="cms-form">
      <div className="cms-grid-2">
        <CField label="Eyebrow" value={d.eyebrow} onChange={v=>setD(p=>({...p,eyebrow:v}))}/>
        <CField label="Abschnittstitel" value={d.title} onChange={v=>setD(p=>({...p,title:v}))}/>
      </div>
      {(d.pillars||[]).map((pillar,i)=>(
        <div key={i} className="cms-pillar">
          <span className="cms-pillar-num">Säule {i+1}</span>
          <CField label="Titel" value={pillar.title} onChange={v=>{const a=clone(d);a.pillars[i].title=v;setD(a);}}/>
          <CField label="Beschreibung" value={pillar.description} onChange={v=>{const a=clone(d);a.pillars[i].description=v;setD(a);}} rows={3}/>
          <span className="field-label">Features</span>
          <div className="cms-grid-2">
            {(pillar.features||[]).map((f,fi)=>(
              <CField key={fi} label={`Feature ${fi+1}`} value={f} onChange={v=>{const a=clone(d);a.pillars[i].features[fi]=v;setD(a);}}/>
            ))}
          </div>
          <CImgPicker label="Bild" value={pillar.image} onChange={v=>{const a=clone(d);a.pillars[i].image=v;setD(a);}} onUpload={onUpload}/>
        </div>
      ))}
      <button className="btn-save" disabled={cmsSaving} onClick={()=>onSave(d)}><I.Check/>{cmsSaving?'Speichert…':'Speichern'}</button>
    </div>
  );
}
function CmsShowroomSection({ initialData, cmsSaving, onSave }) {
  const [d, setD] = useState({...initialData, hotspots: initialData.hotspots.map(h=>({...h}))});
  return (
    <div className="cms-form">
      <div className="cms-grid-2">
        <CField label="Header-Label (oben)" value={d.header} onChange={v=>setD(p=>({...p,header:v}))}/>
        <CField label="Überschrift" value={d.heading} onChange={v=>setD(p=>({...p,heading:v}))}/>
        <CField label="Überschrift Gold" value={d.heading_gold} onChange={v=>setD(p=>({...p,heading_gold:v}))}/>
      </div>
      <CField label="Einleitungstext" value={d.body} onChange={v=>setD(p=>({...p,body:v}))} rows={2}/>
      <span className="field-label" style={{marginTop:'.25rem'}}>Hotspots am Fahrzeug</span>
      {(d.hotspots||[]).map((hs,i)=>(
        <div key={hs.id} className="cms-pillar">
          <span className="cms-pillar-num">{hs.id}</span>
          <div className="cms-grid-2">
            <CField label="Menü-Label" value={hs.label} onChange={v=>{const a=[...d.hotspots];a[i]={...a[i],label:v};setD(p=>({...p,hotspots:a}));}}/>
            <CField label="Karten-Titel" value={hs.title} onChange={v=>{const a=[...d.hotspots];a[i]={...a[i],title:v};setD(p=>({...p,hotspots:a}));}}/>
            <CField label="Badge / Tag" value={hs.tag} onChange={v=>{const a=[...d.hotspots];a[i]={...a[i],tag:v};setD(p=>({...p,hotspots:a}));}}/>
          </div>
          <CField label="Beschreibungstext" value={hs.description} onChange={v=>{const a=[...d.hotspots];a[i]={...a[i],description:v};setD(p=>({...p,hotspots:a}));}} rows={3}/>
        </div>
      ))}
      <button className="btn-save" disabled={cmsSaving} onClick={()=>onSave(d)}><I.Check/>{cmsSaving?'Speichert…':'Speichern'}</button>
    </div>
  );
}
function CmsInquirySection({ initialData, cmsSaving, onSave }) {
  const [d, setD] = useState({...initialData, services: initialData.services.map(s=>({...s}))});
  return (
    <div className="cms-form">
      <div className="cms-grid-2">
        <CField label="Eyebrow" value={d.eyebrow} onChange={v=>setD(p=>({...p,eyebrow:v}))}/>
        <CField label="Abschnittstitel" value={d.title} onChange={v=>setD(p=>({...p,title:v}))}/>
      </div>
      <CField label="Untertitel" value={d.subtitle} onChange={v=>setD(p=>({...p,subtitle:v}))} rows={2}/>
      <span className="field-label">Services (Auswahlkarten im Formular)</span>
      {(d.services||[]).map((s,i)=>(
        <div key={s.id} className="cms-pillar">
          <span className="cms-pillar-num">{s.id}</span>
          <div className="cms-grid-2">
            <CField label="Titel" value={s.title} onChange={v=>{const a=[...d.services];a[i]={...a[i],title:v};setD(p=>({...p,services:a}));}}/>
            <CField label="Kurzbeschreibung" value={s.desc} onChange={v=>{const a=[...d.services];a[i]={...a[i],desc:v};setD(p=>({...p,services:a}));}}/>
          </div>
        </div>
      ))}
      <button className="btn-save" disabled={cmsSaving} onClick={()=>onSave(d)}><I.Check/>{cmsSaving?'Speichert…':'Speichern'}</button>
    </div>
  );
}
function CmsContactSection({ initialData, cmsSaving, onSave }) {
  const [d, setD] = useState({...initialData});
  return (
    <div className="cms-form">
      <CField label="Adresse / Standort" value={d.address} onChange={v=>setD(p=>({...p,address:v}))}/>
      <div className="cms-grid-2">
        <CField label="Telefon" value={d.phone} onChange={v=>setD(p=>({...p,phone:v}))}/>
        <CField label="E-Mail" value={d.email} onChange={v=>setD(p=>({...p,email:v}))}/>
      </div>
      <CField label="Footer-Beschreibungstext" value={d.footer_desc} onChange={v=>setD(p=>({...p,footer_desc:v}))} rows={2}/>
      <CField label="Google Maps Embed-URL" value={d.maps_url} onChange={v=>setD(p=>({...p,maps_url:v}))} hint="URL aus Google Maps → Teilen → Karte einbetten → src=…"/>
      {d.maps_url && (
        <div className="maps-preview">
          <span className="field-label">Vorschau</span>
          <iframe src={d.maps_url} width="100%" height="180" style={{border:0,borderRadius:8,marginTop:6}} loading="lazy" title="Karte"/>
        </div>
      )}
      <button className="btn-save" disabled={cmsSaving} onClick={()=>onSave(d)}><I.Check/>{cmsSaving?'Speichert…':'Speichern'}</button>
    </div>
  );
}
function CmsAccordion({ id, title, openSection, setOpenSection, children }) {
  const isOpen = openSection === id;
  return (
    <div className="cms-section">
      <button className={`cms-sec-btn ${isOpen?'open':''}`} onClick={()=>setOpenSection(isOpen?'':id)}>
        <span>{title}</span><span className="cms-chevron">{isOpen?'▲':'▼'}</span>
      </button>
      {isOpen && <div className="cms-sec-body">{children}</div>}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState('overview');
  const [period, setPeriod] = useState('all');
  const [stats, setStats] = useState(null);
  const [inquiries, setInquiries] = useState([]);
  const [seo, setSeo] = useState({ title: '', description: '', keywords: '' });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actionErr, setActionErr] = useState('');
  const [actionOk, setActionOk] = useState('');
  const [seoSaving, setSeoSaving] = useState(false);
  const [editNote, setEditNote] = useState({});
  const [savingNote, setSavingNote] = useState({});
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [cmsContent, setCmsContent] = useState(null);
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsMsg, setCmsMsg] = useState('');
  const [openSection, setOpenSection] = useState('hero');

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [sRes, iRes, seRes, cRes] = await Promise.all([
        fetch(`/api/stats?period=${period}`),
        fetch('/api/inquiries'),
        fetch('/api/seo'),
        fetch('/api/content'),
      ]);
      if (sRes.ok) { setStats(await sRes.json()); setLastUpdate(new Date()); }
      if (iRes.ok) setInquiries(await iRes.json());
      if (seRes.ok) setSeo(await seRes.json());
      if (cRes.ok) setCmsContent(await cRes.json());
    } catch {}
    finally { setRefreshing(false); }
  }, [period]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/auth');
        if (r.ok) setAuth(true);
      } catch {}
      setChecking(false);
    })();
  }, []);

  useEffect(() => { if (auth) loadData(); }, [auth, loadData]);

  useEffect(() => {
    if (!auth) return;
    const id = setInterval(() => loadData(true), 30000);
    return () => clearInterval(id);
  }, [auth, loadData]);

  const login = async (e) => {
    e.preventDefault(); setLoggingIn(true); setLoginErr('');
    try {
      const r = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (r.ok) setAuth(true);
      else { const d = await r.json(); setLoginErr(d.error || 'Ungültige Anmeldedaten'); }
    } catch { setLoginErr('Verbindungsfehler'); }
    setLoggingIn(false);
  };

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuth(false); setEmail(''); setPassword('');
  };

  const patchInquiry = async (id, payload) => {
    const r = await fetch('/api/inquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...payload }) });
    if (r.ok) {
      const { inquiry } = await r.json();
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, ...inquiry } : i));
    }
  };

  const deleteInquiry = async (id) => {
    if (!confirm('Anfrage wirklich löschen?')) return;
    const r = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
    if (r.ok) setInquiries(prev => prev.filter(i => i.id !== id));
    else setActionErr('Fehler beim Löschen.');
  };

  const saveNote = async (id) => {
    setSavingNote(p => ({ ...p, [id]: true }));
    await patchInquiry(id, { note: editNote[id] ?? (inquiries.find(i => i.id === id)?.note || '') });
    setSavingNote(p => ({ ...p, [id]: false }));
  };

  const exportCSV = () => {
    const cols = ['Datum', 'Name', 'E-Mail', 'Telefon', 'Fahrzeug', 'BJ', 'Services', 'Typ', 'Status', 'Notiz'];
    const rows = inquiries.map(i => [
      fmtTime(i.createdAt), i.name, i.email || '', i.phone || '',
      i.carBrandModel || '', i.carYear || '',
      (i.services || []).join(' | '), i.clientPhilosophy || '', i.status, i.note || ''
    ]);
    const csv = [cols, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `anfragen_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const saveSeo = async (e) => {
    e.preventDefault(); setSeoSaving(true);
    const r = await fetch('/api/seo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(seo) });
    if (r.ok) setActionOk('SEO gespeichert.');
    else setActionErr('SEO Fehler.');
    setSeoSaving(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { setPwMsg('Passwörter stimmen nicht überein.'); return; }
    if (pwForm.next.length < 8) { setPwMsg('Mindestens 8 Zeichen erforderlich.'); return; }
    const r = await fetch('/api/auth/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current: pwForm.current, next: pwForm.next }) });
    if (r.ok) { setPwMsg('✓ Passwort erfolgreich geändert.'); setPwForm({ current: '', next: '', confirm: '' }); }
    else { const d = await r.json(); setPwMsg(d.error || 'Fehler'); }
  };

  const saveCmsSection = async (sectionKey, data) => {
    setCmsSaving(true); setCmsMsg('');
    try {
      const r = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [sectionKey]: data }),
      });
      if (r.ok) { const d = await r.json(); setCmsContent(d); setCmsMsg('✓ Gespeichert'); }
      else setCmsMsg('Fehler beim Speichern.');
    } catch { setCmsMsg('Verbindungsfehler.'); }
    setCmsSaving(false);
    setTimeout(() => setCmsMsg(''), 3000);
  };

  const uploadImage = async (file, onDone) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      if (r.ok) { const d = await r.json(); onDone(d.path); }
      else setCmsMsg('Bild-Upload fehlgeschlagen.');
    } catch { setCmsMsg('Upload-Fehler.'); }
  };

  /* ── Loading ── */
  if (checking) return (
    <div className="a-center">
      <div className="a-spinner"/>
      <style jsx>{`.a-center{height:100vh;display:flex;align-items:center;justify-content:center;background:#0d1117}.a-spinner{width:28px;height:28px;border:2px solid #21262d;border-top-color:#58a6ff;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ── Login ── */
  if (!auth) return (
    <div className="login-bg">
      <form className="login-card" onSubmit={login}>
        <div className="login-brand">
          <div className="login-icon">CD</div>
          <div><p className="login-name">CHRISTIAN DETAILING</p><p className="login-sub">Administration</p></div>
        </div>
        {loginErr && <div className="login-err">{loginErr}</div>}
        <div className="lf-field">
          <label>E-Mail</label>
          <div className="lf-input"><span className="lf-ico"><I.At/></span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@detailing-christian.ch" required/></div>
        </div>
        <div className="lf-field">
          <label>Passwort</label>
          <div className="lf-input"><span className="lf-ico"><I.Lock/></span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/></div>
        </div>
        <button type="submit" className="login-btn" disabled={loggingIn}>{loggingIn ? 'Verifiziere…' : 'Anmelden'}</button>
      </form>
      <style jsx>{`
        .login-bg{min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 0%,#161b22,#0d1117 60%);padding:2rem;font-family:system-ui}
        .login-card{background:#161b22;border:1px solid #30363d;border-radius:16px;padding:3rem 2.5rem;width:100%;max-width:420px;display:flex;flex-direction:column;gap:1.25rem;box-shadow:0 24px 64px rgba(0,0,0,.6)}
        .login-brand{display:flex;align-items:center;gap:.8rem;padding-bottom:1.5rem;border-bottom:1px solid #21262d}
        .login-icon{width:46px;height:46px;border-radius:10px;background:linear-gradient(135deg,#58a6ff,#1f6feb);display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;color:#fff}
        .login-name{font-size:.85rem;font-weight:700;color:#e6edf3;letter-spacing:.1em}
        .login-sub{font-size:.72rem;color:#768390;letter-spacing:.05em}
        .login-err{background:rgba(248,81,73,.1);border:1px solid rgba(248,81,73,.3);color:#f85149;padding:.75rem 1rem;border-radius:8px;font-size:.85rem}
        .lf-field{display:flex;flex-direction:column;gap:.35rem}
        .lf-field label{font-size:.72rem;color:#768390;text-transform:uppercase;letter-spacing:.05em}
        .lf-input{position:relative;display:flex;align-items:center}
        .lf-ico{position:absolute;left:.85rem;color:#768390;display:flex;pointer-events:none}
        .lf-input input{width:100%;background:#0d1117;border:1px solid #30363d;border-radius:8px;padding:.8rem 1rem .8rem 2.75rem;color:#e6edf3;font-size:.9rem;outline:none;transition:border-color .2s}
        .lf-input input:focus{border-color:#58a6ff;box-shadow:0 0 0 3px rgba(88,166,255,.08)}
        .login-btn{background:linear-gradient(135deg,#238636,#2ea043);color:#fff;border:none;border-radius:8px;padding:.9rem;font-size:.9rem;font-weight:600;cursor:pointer;transition:opacity .2s;margin-top:.25rem}
        .login-btn:hover{opacity:.88}
        .login-btn:disabled{opacity:.5;cursor:not-allowed}
      `}</style>
    </div>
  );

  /* ── Computed ── */
  const topCountries = (stats?.countries || []).slice(0, 8);
  const maxCountry = topCountries[0]?.count || 1;
  const COLORS = {
    countries: ['#58a6ff','#3fb950','#d2a679','#f78166','#a5d6ff','#56d364','#79c0ff','#ff9f43'],
    devices:   ['#58a6ff','#3fb950','#d2a679'],
    browsers:  ['#f78166','#d2a679','#79c0ff','#a5d6ff','#56d364'],
  };
  const pendingCount = inquiries.filter(i => i.status === 'pending').length;

  const TABS = [
    { id: 'overview',  Icon: I.Chart,  label: 'Übersicht' },
    { id: 'geo',       Icon: I.Globe,  label: 'Herkunft' },
    { id: 'inquiries', Icon: I.Inbox,  label: `Anfragen${pendingCount ? ` (${pendingCount})` : ''}` },
    { id: 'seo',       Icon: I.Search, label: 'SEO' },
    { id: 'cms',       Icon: I.File,   label: 'Inhalte' },
    { id: 'settings',  Icon: I.Cog,    label: 'Einstellungen' },
  ];

  return (
    <div className="dash">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-ico">CD</div>
          <div><p className="brand-name">CHRISTIAN</p><p className="brand-sub">ADMIN CONSOLE</p></div>
        </div>
        <nav className="nav">
          {TABS.map(({ id, Icon, label }) => (
            <button key={id} className={`nav-btn ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
              <span className="nav-ico"><Icon/></span>{label}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          {lastUpdate && (
            <div className="live-row">
              <span className={`live-dot${refreshing ? ' spin' : ''}`}/>
              <span className="live-txt">Live · {lastUpdate.toLocaleTimeString('de-CH')}</span>
            </div>
          )}
          <button className="btn-outline" onClick={() => loadData()} disabled={refreshing}>
            <I.Refresh/>{refreshing ? 'Lädt…' : 'Aktualisieren'}
          </button>
          <button className="btn-logout" onClick={logout}><I.LogOut/>Abmelden</button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="content">
        {(actionErr || actionOk) && (
          <div className={`banner ${actionErr ? 'b-err' : 'b-ok'}`}>
            {actionErr || actionOk}
            <button onClick={() => { setActionErr(''); setActionOk(''); }}>×</button>
          </div>
        )}

        {/* ════ OVERVIEW ════ */}
        {tab === 'overview' && (
          <div className="tab">
            <div className="tab-head">
              <div><h1>Übersicht</h1><p>Alle Besucher · Echtzeit</p></div>
              <div className="period-grp">
                {[['today','Heute'],['7d','7 Tage'],['30d','30 Tage'],['all','Gesamt']].map(([v,l]) => (
                  <button key={v} className={`period-btn ${period===v?'on':''}`} onClick={() => setPeriod(v)}>{l}</button>
                ))}
              </div>
            </div>

            {/* Active now */}
            <div className="active-now">
              <span className="active-pulse"/>
              <span className="active-num">{stats?.activeNow ?? 0}</span>
              <div>
                <div className="active-title">Besucher gerade aktiv</div>
                <div className="active-sub">Letzte 5 Minuten · aktualisiert alle 30s</div>
              </div>
            </div>

            {/* KPIs */}
            <div className="kpi-grid">
              {[
                { label:'Seitenaufrufe',   val: stats?.totalViews,      Icon: I.Eye,     c:'#58a6ff' },
                { label:'Unique Besucher', val: stats?.uniqueVisitors,  Icon: I.User,    c:'#3fb950' },
                { label:'Ø Verweildauer',  val: fmtDuration(stats?.avgDuration), Icon: I.Clock, c:'#d2a679' },
                { label:'Bounce Rate',     val: stats?.bounceRate != null ? `${stats.bounceRate}%` : '—', Icon: I.Bounce, c:'#a78bfa' },
                { label:'Anfragen',        val: stats?.totalInquiries,  Icon: I.Mail,    c:'#f78166' },
                { label:'Ausstehend',      val: stats?.pendingInquiries, Icon: I.Bell,   c:'#f85149' },
              ].map(k => (
                <div key={k.label} className="kpi" style={{ '--c': k.c }}>
                  <div className="kpi-ico"><k.Icon/></div>
                  <div className="kpi-val">{k.val ?? '—'}</div>
                  <div className="kpi-lbl">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Sparkline */}
            <div className="card">
              <div className="card-head"><h3>Besucher-Verlauf</h3><span className="badge">{stats?.dailyVisits?.length ?? 0} Tage</span></div>
              <LineChart data={stats?.dailyVisits || []}/>
            </div>

            <div className="row2">
              <div className="card">
                <div className="card-head"><h3>Geräte</h3></div>
                <DonutChart data={[
                  { label:'Desktop', value: stats?.devices?.desktop||0 },
                  { label:'Mobile',  value: stats?.devices?.mobile||0 },
                  { label:'Tablet',  value: stats?.devices?.tablet||0 },
                ]} colors={COLORS.devices}/>
              </div>
              <div className="card">
                <div className="card-head"><h3>Browser</h3></div>
                <DonutChart
                  data={(stats?.browsers||[]).slice(0,5).map(b=>({ label:b.name, value:b.count }))}
                  colors={COLORS.browsers}
                />
              </div>
            </div>

            <div className="row2">
              <div className="card">
                <div className="card-head"><h3>Beliebteste Seiten</h3></div>
                <table className="tbl">
                  <thead><tr><th>Seite</th><th align="right">Aufrufe</th></tr></thead>
                  <tbody>
                    {(stats?.pageViews||[]).slice(0,7).map((p,i) => (
                      <tr key={i}><td>{p.page}</td><td align="right"><b style={{color:'#58a6ff'}}>{p.count}</b></td></tr>
                    ))}
                    {!stats?.pageViews?.length && <tr><td colSpan="2" className="tbl-empty">Keine Daten</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="card">
                <div className="card-head"><h3>Traffic-Quellen</h3></div>
                <table className="tbl">
                  <thead><tr><th>Quelle</th><th align="right">Besuche</th></tr></thead>
                  <tbody>
                    {(stats?.referrers||[]).slice(0,7).map((r,i) => (
                      <tr key={i}><td>{r.name}</td><td align="right"><b style={{color:'#3fb950'}}>{r.count}</b></td></tr>
                    ))}
                    {!stats?.referrers?.length && <tr><td colSpan="2" className="tbl-empty">Keine Daten</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════ GEO ════ */}
        {tab === 'geo' && (
          <div className="tab">
            <div className="tab-head">
              <div><h1>Herkunft</h1><p>Länder · Regionen · Städte</p></div>
              <div className="period-grp">
                {[['today','Heute'],['7d','7 Tage'],['30d','30 Tage'],['all','Gesamt']].map(([v,l]) => (
                  <button key={v} className={`period-btn ${period===v?'on':''}`} onClick={() => setPeriod(v)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="row2 row2-60">
              <div className="card">
                <div className="card-head"><h3>Länder</h3><span className="badge">{topCountries.length}</span></div>
                {topCountries.length ? (
                  <div className="country-list">
                    {topCountries.map((c,i) => (
                      <HBar key={i} label={`${flagEmoji(c.countryCode)} ${c.country}`} count={c.count} max={maxCountry} color={COLORS.countries[i%8]}/>
                    ))}
                  </div>
                ) : <p className="empty-hint">Noch keine Geo-Daten. Nächster echter Besuch wird erfasst.</p>}
              </div>
              <div className="card">
                <div className="card-head"><h3>Verteilung</h3></div>
                <DonutChart
                  data={topCountries.slice(0,6).map(c=>({ label:`${flagEmoji(c.countryCode)} ${c.country}`, value:c.count }))}
                  colors={COLORS.countries}
                />
              </div>
            </div>

            <div className="card">
              <div className="card-head"><h3>Städte &amp; Regionen</h3></div>
              <table className="tbl">
                <thead><tr><th>Ort</th><th align="right">Besuche</th></tr></thead>
                <tbody>
                  {(stats?.regions||[]).slice(0,12).map((r,i) => (
                    <tr key={i}>
                      <td><span className="pin-ico"><I.Pin/></span>{r.name}</td>
                      <td align="right"><b style={{color:'#d2a679'}}>{r.count}</b></td>
                    </tr>
                  ))}
                  {!stats?.regions?.length && <tr><td colSpan="2" className="tbl-empty">Keine Daten</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ INQUIRIES ════ */}
        {tab === 'inquiries' && (
          <div className="tab">
            <div className="tab-head">
              <div><h1>Kundenanfragen</h1><p>{inquiries.length} total · {pendingCount} ausstehend</p></div>
              <button className="btn-export" onClick={exportCSV}><I.Download/>CSV Export</button>
            </div>
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              {inquiries.length ? (
                <div style={{ overflowX:'auto' }}>
                  <table className="inq-tbl">
                    <thead>
                      <tr><th>Datum</th><th>Kunde</th><th>Fahrzeug</th><th>Services</th><th>Typ</th><th>Status</th><th>Notiz</th><th></th></tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inq => {
                        const isPremium = inq.clientPhilosophy === 'value_preservation';
                        const isBudget  = inq.clientPhilosophy === 'budget_oriented';
                        const noteVal = editNote[inq.id] !== undefined ? editNote[inq.id] : (inq.note || '');
                        return (
                          <tr key={inq.id} className={`inq-${inq.status}`}>
                            <td className="inq-date">{fmtTime(inq.createdAt)}</td>
                            <td><div className="inq-name">{inq.name}</div><div className="inq-sub">{inq.email}{inq.phone?` · ${inq.phone}`:''}</div></td>
                            <td><div>{inq.carBrandModel}</div><div className="inq-sub">{inq.carYear?`BJ ${inq.carYear}`:''}</div></td>
                            <td><div className="pills">{(inq.services||[]).map(s=><span key={s} className="pill">{s}</span>)}</div></td>
                            <td>
                              {isPremium && <span className="btyp premium"><I.Star/>Premium</span>}
                              {isBudget  && <span className="btyp budget"><I.Warning/>Budget</span>}
                              {!isPremium&&!isBudget && <span className="btyp normal">Standard</span>}
                            </td>
                            <td>
                              <select value={inq.status} className={`sel sel-${inq.status}`} onChange={e=>patchInquiry(inq.id,{status:e.target.value})}>
                                <option value="pending">Ausstehend</option>
                                <option value="contacted">Kontaktiert</option>
                                <option value="archived">Archiviert</option>
                              </select>
                            </td>
                            <td className="note-cell">
                              <div className="note-wrap">
                                <textarea className="note-input" rows={2} placeholder="Notiz…" value={noteVal}
                                  onChange={e=>setEditNote(p=>({...p,[inq.id]:e.target.value}))}/>
                                <button className="note-save" onClick={()=>saveNote(inq.id)} disabled={savingNote[inq.id]}>
                                  {savingNote[inq.id]?'…':<I.Check/>}
                                </button>
                              </div>
                            </td>
                            <td><button className="btn-del" onClick={()=>deleteInquiry(inq.id)}><I.Delete/></button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : <p className="empty-hint" style={{padding:'3rem',textAlign:'center'}}>Noch keine Anfragen.</p>}
            </div>
          </div>
        )}

        {/* ════ SEO ════ */}
        {tab === 'seo' && (
          <div className="tab">
            <div className="tab-head"><div><h1>SEO &amp; Meta</h1><p>Google-Ranking optimieren</p></div></div>
            <div className="seo-layout">
              <form className="card seo-form" onSubmit={saveSeo}>
                {[
                  { id:'title',       label:'Meta Title',       hint:'50–60 Zeichen' },
                  { id:'description', label:'Meta Description', hint:'150–160 Zeichen', rows:4 },
                  { id:'keywords',    label:'Keywords',         hint:'Kommagetrennt' },
                ].map(f => (
                  <div key={f.id} className="field">
                    <label>{f.label}</label>
                    {f.rows
                      ? <textarea rows={f.rows} value={seo[f.id]||''} onChange={e=>setSeo(p=>({...p,[f.id]:e.target.value}))} required/>
                      : <input type="text" value={seo[f.id]||''} onChange={e=>setSeo(p=>({...p,[f.id]:e.target.value}))} required/>
                    }
                    <span className="hint">{f.hint} — {(seo[f.id]||'').length} Zeichen</span>
                  </div>
                ))}
                <button type="submit" className="btn-save" disabled={seoSaving}><I.Check/>{seoSaving?'Speichert…':'SEO Speichern'}</button>
              </form>
              <div className="card">
                <h3 className="preview-title">Google Vorschau</h3>
                <div className="g-snippet">
                  <div className="g-url">https://detailing-christian.ch ▾</div>
                  <div className="g-title">{seo.title||'Seitentitel…'}</div>
                  <div className="g-desc">{seo.description||'Beschreibung…'}</div>
                </div>
                {[['Title',seo.title||'',60],['Desc.',seo.description||'',160]].map(([n,v,m])=>(
                  <div key={n} className="char-row">
                    <span>{n}</span>
                    <div className="char-bar"><div className="char-fill" style={{width:`${Math.min((v.length/m)*100,100)}%`,background:v.length>m?'#f85149':'#3fb950'}}/></div>
                    <span className={v.length>m?'over':''}>{v.length}/{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ CMS ════ */}
        {tab === 'cms' && (
          !cmsContent
          ? <div className="tab"><p className="empty-hint">Inhalte werden geladen…</p></div>
          : <div className="tab">
              <div className="tab-head">
                <div><h1>Inhalte</h1><p>Alle Texte, Bilder &amp; Hotspots direkt bearbeiten</p></div>
                {cmsMsg && <span className={cmsMsg.startsWith('✓')?'msg-ok':'msg-err'} style={{alignSelf:'center'}}>{cmsMsg}</span>}
              </div>
              <CmsAccordion id="hero" title="Hero — Einstiegsbereich" openSection={openSection} setOpenSection={setOpenSection}>
                <CmsHeroSection key={`hero-${openSection}`} initialData={cmsContent.hero} cmsSaving={cmsSaving} onSave={d=>saveCmsSection('hero',d)} onUpload={uploadImage}/>
              </CmsAccordion>
              <CmsAccordion id="philosophy" title="Philosophie — Zitat & Statistiken" openSection={openSection} setOpenSection={setOpenSection}>
                <CmsPhilSection key="phil" initialData={cmsContent.philosophy} cmsSaving={cmsSaving} onSave={d=>saveCmsSection('philosophy',d)}/>
              </CmsAccordion>
              <CmsAccordion id="services" title="Leistungen — 4 Säulen" openSection={openSection} setOpenSection={setOpenSection}>
                <CmsServicesSection key="sv" initialData={cmsContent.services} cmsSaving={cmsSaving} onSave={d=>saveCmsSection('services',d)} onUpload={uploadImage}/>
              </CmsAccordion>
              <CmsAccordion id="showroom" title="3D Showroom — Texte & Hotspots" openSection={openSection} setOpenSection={setOpenSection}>
                <CmsShowroomSection key="sr" initialData={cmsContent.showroom} cmsSaving={cmsSaving} onSave={d=>saveCmsSection('showroom',d)}/>
              </CmsAccordion>
              <CmsAccordion id="inquiry" title="Anfrage-Formular — Services & Header" openSection={openSection} setOpenSection={setOpenSection}>
                <CmsInquirySection key="inq" initialData={cmsContent.inquiry} cmsSaving={cmsSaving} onSave={d=>saveCmsSection('inquiry',d)}/>
              </CmsAccordion>
              <CmsAccordion id="contact" title="Kontakt, Footer & Google Maps" openSection={openSection} setOpenSection={setOpenSection}>
                <CmsContactSection key="ct" initialData={cmsContent.contact} cmsSaving={cmsSaving} onSave={d=>saveCmsSection('contact',d)}/>
              </CmsAccordion>
            </div>
        )}

        {/* ════ SETTINGS ════ */}
        {tab === 'settings' && (
          <div className="tab">
            <div className="tab-head"><div><h1>Einstellungen</h1><p>Zugangsdaten &amp; Benachrichtigungen</p></div></div>
            <div className="settings-layout">
              <div className="card">
                <div className="card-head"><h3>Passwort ändern</h3></div>
                <form onSubmit={changePassword} className="settings-form">
                  {[
                    { label:'Aktuelles Passwort',        k:'current' },
                    { label:'Neues Passwort',             k:'next' },
                    { label:'Neues Passwort wiederholen', k:'confirm' },
                  ].map(f=>(
                    <div key={f.k} className="field">
                      <label>{f.label}</label>
                      <div className="lf-input"><span className="lf-ico"><I.Lock/></span>
                        <input type="password" value={pwForm[f.k]} onChange={e=>setPwForm(p=>({...p,[f.k]:e.target.value}))} required placeholder="••••••••"/>
                      </div>
                    </div>
                  ))}
                  {pwMsg && <p className={pwMsg.startsWith('✓')?'msg-ok':'msg-err'}>{pwMsg}</p>}
                  <button type="submit" className="btn-save"><I.Check/>Passwort speichern</button>
                </form>
              </div>
              <div className="card">
                <div className="card-head"><h3>E-Mail Benachrichtigungen</h3></div>
                <div className="notif-info">
                  <p>Bei jeder neuen Anfrage wird eine E-Mail gesendet. Konfiguriere folgendes in <code>.env.local</code>:</p>
                  <pre>{`NOTIFY_EMAIL=deine@email.ch\nNOTIFY_FROM=noreply@detailing-christian.ch\nSMTP_HOST=smtp.gmail.com\nSMTP_PORT=587\nSMTP_USER=...\nSMTP_PASS=...`}</pre>
                  <p className="hint-txt">Server-Neustart nach Änderung erforderlich.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <style jsx>{`
        /* ── Layout ── */
        .dash{display:grid;grid-template-columns:240px 1fr;min-height:100vh;background:#0d1117;color:#e6edf3;font-family:system-ui,-apple-system,sans-serif}
        @media(max-width:860px){.dash{grid-template-columns:1fr}}

        /* ── Sidebar ── */
        .sidebar{background:#161b22;border-right:1px solid #21262d;padding:1.5rem 1rem;display:flex;flex-direction:column;gap:.75rem;position:sticky;top:0;height:100vh;overflow-y:auto}
        .brand{display:flex;align-items:center;gap:.7rem;padding-bottom:1.25rem;border-bottom:1px solid #21262d}
        .brand-ico{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#58a6ff,#1f6feb);display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:700;color:#fff;flex-shrink:0}
        .brand-name{font-size:.82rem;font-weight:700;letter-spacing:.1em;color:#e6edf3}
        .brand-sub{font-size:.62rem;color:#768390;letter-spacing:.07em;margin-top:2px}
        .nav{display:flex;flex-direction:column;gap:.15rem;flex:1}
        .nav-btn{display:flex;align-items:center;gap:.65rem;background:transparent;border:none;color:#768390;text-align:left;padding:.65rem .75rem;border-radius:7px;font-size:.84rem;cursor:pointer;transition:all .18s;width:100%}
        .nav-btn:hover{background:#21262d;color:#e6edf3}
        .nav-btn.active{background:rgba(88,166,255,.1);color:#58a6ff;font-weight:600;border-left:2px solid #58a6ff;padding-left:calc(.75rem - 2px)}
        .nav-ico{display:flex;align-items:center;width:18px;flex-shrink:0}
        .sidebar-foot{display:flex;flex-direction:column;gap:.4rem;padding-top:.75rem;border-top:1px solid #21262d}
        .live-row{display:flex;align-items:center;gap:.4rem;padding:.25rem 0}
        .live-dot{width:7px;height:7px;border-radius:50%;background:#3fb950;box-shadow:0 0 5px #3fb950;flex-shrink:0}
        .live-dot.spin{background:#d2a679;animation:pulse .6s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .live-txt{font-size:.7rem;color:#768390;font-variant-numeric:tabular-nums}
        .btn-outline{display:flex;align-items:center;gap:.45rem;background:#21262d;border:1px solid #30363d;color:#768390;padding:.5rem .75rem;border-radius:6px;font-size:.78rem;cursor:pointer;transition:all .18s;width:100%}
        .btn-outline:hover:not(:disabled){border-color:#58a6ff;color:#58a6ff}
        .btn-outline:disabled{opacity:.45;cursor:not-allowed}
        .btn-logout{display:flex;align-items:center;gap:.45rem;background:transparent;border:1px solid #30363d;color:#768390;padding:.5rem .75rem;border-radius:6px;font-size:.78rem;cursor:pointer;transition:all .18s;width:100%}
        .btn-logout:hover{border-color:#f85149;color:#f85149}

        /* ── Content ── */
        .content{padding:2rem 2.5rem;min-height:100vh}
        @media(max-width:600px){.content{padding:1.25rem 1rem}}
        .tab{display:flex;flex-direction:column;gap:1.25rem}

        /* ── Banners ── */
        .banner{padding:.8rem 1rem;border-radius:8px;font-size:.85rem;display:flex;align-items:center;justify-content:space-between;margin-bottom:.25rem}
        .banner button{background:none;border:none;color:inherit;cursor:pointer;font-size:1rem}
        .b-err{background:rgba(248,81,73,.1);border:1px solid rgba(248,81,73,.3);color:#f85149}
        .b-ok{background:rgba(63,185,80,.1);border:1px solid rgba(63,185,80,.3);color:#3fb950}

        /* ── Tab header ── */
        .tab-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap}
        .tab-head h1{font-size:1.6rem;font-weight:700;color:#e6edf3;letter-spacing:-.02em;margin-bottom:.15rem}
        .tab-head p{font-size:.85rem;color:#768390}

        /* ── Period filter ── */
        .period-grp{display:flex;gap:.3rem;background:#161b22;border:1px solid #21262d;border-radius:8px;padding:.3rem}
        .period-btn{background:transparent;border:none;color:#768390;padding:.35rem .75rem;border-radius:6px;font-size:.8rem;cursor:pointer;transition:all .18s}
        .period-btn.on{background:#21262d;color:#e6edf3;font-weight:600}
        .period-btn:hover:not(.on){color:#e6edf3}

        /* ── Active now ── */
        .active-now{display:flex;align-items:center;gap:1rem;background:rgba(63,185,80,.06);border:1px solid rgba(63,185,80,.2);border-radius:10px;padding:.9rem 1.5rem}
        .active-pulse{width:10px;height:10px;border-radius:50%;background:#3fb950;box-shadow:0 0 0 0 rgba(63,185,80,.5);animation:ripple 2s ease-out infinite;flex-shrink:0}
        @keyframes ripple{0%{box-shadow:0 0 0 0 rgba(63,185,80,.5)}70%{box-shadow:0 0 0 12px rgba(63,185,80,0)}100%{box-shadow:0 0 0 0 rgba(63,185,80,0)}}
        .active-num{font-size:2rem;font-weight:700;color:#3fb950;font-variant-numeric:tabular-nums;line-height:1}
        .active-title{font-size:.9rem;color:#e6edf3;font-weight:600}
        .active-sub{font-size:.75rem;color:#768390;margin-top:2px}

        /* ── KPI ── */
        .kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:.85rem}
        .kpi{background:#161b22;border:1px solid #21262d;border-radius:10px;padding:1.1rem;position:relative;overflow:hidden;transition:border-color .2s,transform .2s;cursor:default}
        .kpi:hover{border-color:var(--c);transform:translateY(-2px)}
        .kpi::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--c);opacity:.6}
        .kpi-ico{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--c) 12%,transparent);color:var(--c);margin-bottom:.55rem}
        .kpi-val{font-size:1.65rem;font-weight:700;line-height:1;color:var(--c);font-variant-numeric:tabular-nums}
        .kpi-lbl{font-size:.73rem;color:#768390;margin-top:.3rem;letter-spacing:.02em}

        /* ── Card ── */
        .card{background:#161b22;border:1px solid #21262d;border-radius:10px;padding:1.35rem}
        .card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
        .card-head h3{font-size:.9rem;font-weight:600;color:#e6edf3}
        .badge{font-size:.68rem;background:#21262d;color:#768390;padding:.18rem .55rem;border-radius:20px}
        .row2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .row2-60{grid-template-columns:1.5fr 1fr}
        @media(max-width:860px){.row2,.row2-60{grid-template-columns:1fr}}

        /* ── Line chart ── */
        .cf-chart{display:flex;flex-direction:column;gap:.5rem}
        .cf-svg{width:100%;height:110px;display:block}
        .cf-labels{display:flex;justify-content:space-between;font-size:.7rem;color:#768390;padding:0 2px}

        /* ── Donut ── */
        .donut-wrap{display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap}
        .donut-legend{list-style:none;display:flex;flex-direction:column;gap:.5rem;min-width:100px}
        .donut-legend li{display:flex;align-items:center;gap:.4rem;font-size:.76rem;color:#768390}
        .d-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .d-lbl{flex:1}
        .d-val{color:#e6edf3;font-weight:600;font-size:.74rem}

        /* ── Table ── */
        .tbl{width:100%;border-collapse:collapse;font-size:.84rem}
        .tbl th{text-align:left;font-size:.68rem;color:#768390;text-transform:uppercase;letter-spacing:.04em;padding-bottom:.65rem;border-bottom:1px solid #21262d}
        .tbl td{padding:.62rem 0;color:#8b949e;border-bottom:1px solid rgba(255,255,255,.03)}
        .tbl tr:last-child td{border-bottom:none}
        .tbl-empty{color:#768390;font-size:.83rem}
        .empty-hint{font-size:.83rem;color:#768390;padding:.5rem 0}

        /* ── Geo ── */
        .country-list{display:flex;flex-direction:column;gap:.6rem}
        .hbar{display:grid;grid-template-columns:160px 1fr 34px;align-items:center;gap:.6rem;font-size:.82rem}
        .hbar-lbl{color:#8b949e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .hbar-track{height:5px;background:#21262d;border-radius:4px;overflow:hidden}
        .hbar-fill{height:100%;border-radius:4px;transition:width .5s ease}
        .hbar-cnt{color:#e6edf3;font-weight:600;text-align:right;font-size:.76rem}
        .pin-ico{display:inline-flex;align-items:center;margin-right:5px;color:#768390;vertical-align:middle}

        /* ── Inquiries ── */
        .btn-export{display:inline-flex;align-items:center;gap:.4rem;background:#21262d;border:1px solid #30363d;color:#768390;padding:.5rem 1rem;border-radius:7px;font-size:.8rem;cursor:pointer;transition:all .18s;white-space:nowrap}
        .btn-export:hover{border-color:#3fb950;color:#3fb950}
        .inq-tbl{width:100%;border-collapse:collapse;font-size:.82rem;min-width:900px}
        .inq-tbl th{background:#0d1117;padding:.8rem 1rem;font-size:.67rem;color:#768390;text-transform:uppercase;letter-spacing:.04em;text-align:left;border-bottom:1px solid #21262d;white-space:nowrap}
        .inq-tbl td{padding:.75rem 1rem;border-bottom:1px solid rgba(255,255,255,.03);vertical-align:top}
        .inq-tbl tr:last-child td{border-bottom:none}
        .inq-pending td{background:rgba(210,166,121,.02)}
        .inq-contacted td{opacity:.72}
        .inq-archived td{opacity:.38}
        .inq-date{font-size:.73rem;color:#768390;white-space:nowrap}
        .inq-name{font-weight:600;color:#e6edf3;margin-bottom:2px}
        .inq-sub{font-size:.73rem;color:#768390}
        .pills{display:flex;flex-wrap:wrap;gap:3px}
        .pill{font-size:.67rem;background:#21262d;color:#8b949e;padding:2px 7px;border-radius:4px}
        .btyp{font-size:.68rem;padding:3px 7px;border-radius:4px;white-space:nowrap;display:inline-flex;align-items:center;gap:4px}
        .btyp.premium{background:rgba(210,166,121,.15);color:#d2a679;border:1px solid rgba(210,166,121,.3)}
        .btyp.budget{background:rgba(248,81,73,.1);color:#f85149;border:1px solid rgba(248,81,73,.2)}
        .btyp.normal{background:#21262d;color:#768390;border:1px solid #30363d}
        .sel{background:#0d1117;border:1px solid #30363d;color:#c9d1d9;padding:.3rem .55rem;border-radius:6px;font-size:.76rem;cursor:pointer;outline:none}
        .sel:focus{border-color:#58a6ff}
        .sel-pending{border-color:rgba(210,166,121,.5);color:#d2a679}
        .sel-contacted{border-color:rgba(63,185,80,.5);color:#3fb950}
        .sel-archived{border-color:#30363d;color:#768390}
        .note-cell{min-width:175px}
        .note-wrap{display:flex;align-items:flex-start;gap:.3rem}
        .note-input{background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;font-size:.76rem;padding:.38rem .55rem;resize:none;width:145px;outline:none;font-family:inherit}
        .note-input:focus{border-color:#58a6ff}
        .note-save{background:#21262d;border:1px solid #30363d;color:#3fb950;border-radius:5px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;padding:0}
        .note-save:hover{border-color:#3fb950}
        .note-save:disabled{opacity:.4}
        .btn-del{background:transparent;border:1px solid rgba(248,81,73,.2);color:#f85149;width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .18s;padding:0}
        .btn-del:hover{background:rgba(248,81,73,.1);border-color:#f85149}

        /* ── SEO ── */
        .seo-layout{display:grid;grid-template-columns:1.3fr .7fr;gap:1.25rem;align-items:start}
        @media(max-width:860px){.seo-layout{grid-template-columns:1fr}}
        .seo-form{display:flex;flex-direction:column;gap:1.1rem}
        .field{display:flex;flex-direction:column;gap:.35rem}
        .field label{font-size:.72rem;color:#768390;text-transform:uppercase;letter-spacing:.04em}
        .field input,.field textarea{background:#0d1117;border:1px solid #30363d;border-radius:7px;padding:.72rem .85rem;color:#e6edf3;font-size:.88rem;outline:none;transition:border-color .2s;resize:vertical;font-family:inherit}
        .field input:focus,.field textarea:focus{border-color:#58a6ff;box-shadow:0 0 0 3px rgba(88,166,255,.07)}
        .hint{font-size:.7rem;color:#768390}
        .btn-save{display:inline-flex;align-items:center;gap:.45rem;background:linear-gradient(135deg,#238636,#2ea043);color:#fff;border:none;border-radius:7px;padding:.78rem 1.25rem;font-size:.88rem;font-weight:600;cursor:pointer;transition:opacity .18s,transform .18s;align-self:flex-start}
        .btn-save:hover{opacity:.88;transform:translateY(-1px)}
        .btn-save:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .preview-title{font-size:.72rem;color:#768390;text-transform:uppercase;letter-spacing:.07em;margin-bottom:.85rem}
        .g-snippet{background:#fff;border-radius:8px;padding:1rem 1.25rem;margin-bottom:1.25rem}
        .g-url{font-size:13px;color:#006621;margin-bottom:3px}
        .g-title{font-size:17px;color:#1a0dab;margin-bottom:4px;font-family:Arial,sans-serif}
        .g-desc{font-size:13px;color:#4d5156;line-height:1.55;font-family:Arial,sans-serif}
        .char-row{display:grid;grid-template-columns:40px 1fr 48px;align-items:center;gap:.45rem;font-size:.72rem;color:#768390;margin-bottom:.5rem}
        .char-bar{height:4px;background:#21262d;border-radius:3px;overflow:hidden}
        .char-fill{height:100%;border-radius:3px;transition:width .3s,background .3s}
        .over{color:#f85149}

        /* ── Settings ── */
        .settings-layout{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;align-items:start}
        @media(max-width:860px){.settings-layout{grid-template-columns:1fr}}
        .settings-form{display:flex;flex-direction:column;gap:1rem}
        .lf-input{position:relative;display:flex;align-items:center}
        .lf-ico{position:absolute;left:.85rem;color:#768390;display:flex;pointer-events:none}
        .lf-input input{width:100%;background:#0d1117;border:1px solid #30363d;border-radius:7px;padding:.72rem 1rem .72rem 2.7rem;color:#e6edf3;font-size:.88rem;outline:none;transition:border-color .2s}
        .lf-input input:focus{border-color:#58a6ff;box-shadow:0 0 0 3px rgba(88,166,255,.07)}
        .msg-ok{font-size:.82rem;color:#3fb950;background:rgba(63,185,80,.1);border:1px solid rgba(63,185,80,.3);padding:.6rem .85rem;border-radius:6px}
        .msg-err{font-size:.82rem;color:#f85149;background:rgba(248,81,73,.1);border:1px solid rgba(248,81,73,.3);padding:.6rem .85rem;border-radius:6px}
        .notif-info{display:flex;flex-direction:column;gap:.75rem;font-size:.84rem;color:#8b949e;line-height:1.6}
        .notif-info pre{background:#0d1117;border:1px solid #21262d;border-radius:7px;padding:.85rem 1rem;font-size:.76rem;color:#79c0ff;overflow-x:auto;line-height:1.75}
        .notif-info code{background:#21262d;padding:.1rem .35rem;border-radius:4px;font-size:.78rem;color:#79c0ff}
        .hint-txt{font-size:.73rem;color:#768390}

        /* ── CMS ── */
        .cms-section{border:1px solid #21262d;border-radius:10px;overflow:hidden;background:#161b22}
        .cms-sec-btn{width:100%;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;color:#e6edf3;padding:1rem 1.25rem;font-size:.88rem;font-weight:600;cursor:pointer;text-align:left;transition:background .18s}
        .cms-sec-btn:hover{background:#21262d}
        .cms-sec-btn.open{background:#1c2128;border-bottom:1px solid #21262d}
        .cms-chevron{font-size:.6rem;color:#768390}
        .cms-sec-body{padding:1.25rem;display:flex;flex-direction:column;gap:1rem;background:#0d1117}
        .cms-form{display:flex;flex-direction:column;gap:1rem}
        .cms-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}
        .cms-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.85rem}
        @media(max-width:760px){.cms-grid-2,.cms-grid-3{grid-template-columns:1fr}}
        .cms-pillar{border:1px solid #21262d;border-radius:8px;padding:1rem;display:flex;flex-direction:column;gap:.85rem;background:#161b22}
        .cms-pillar-num{font-size:.68rem;color:#58a6ff;text-transform:uppercase;letter-spacing:.1em;font-weight:600}
        .field-label{font-size:.72rem;color:#768390;text-transform:uppercase;letter-spacing:.04em;margin-top:.25rem}
        .cms-hint{color:#768390;font-size:.7rem;font-weight:400;text-transform:none;letter-spacing:0}
        .img-picker{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;margin-top:.25rem}
        .img-preview{width:72px;height:48px;object-fit:cover;border-radius:5px;border:1px solid #30363d}
        .btn-upload{display:inline-flex;align-items:center;gap:.35rem;background:#21262d;border:1px solid #30363d;color:#768390;padding:.45rem .85rem;border-radius:6px;font-size:.78rem;cursor:pointer;transition:all .18s}
        .btn-upload:hover{border-color:#58a6ff;color:#58a6ff}
        .img-path{font-size:.7rem;color:#768390;word-break:break-all}
      `}</style>
    </div>
  );
}
