'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function StatsTracker() {
  const pathname = usePathname();
  const lastPath = useRef(null);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const ua = navigator.userAgent;

    let browser = 'Andere';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Opr/') || ua.includes('Opera')) browser = 'Opera';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';

    let device = 'desktop';
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) device = 'mobile';
    else if (/Tablet|iPad|PlayBook|Silk/i.test(ua)) device = 'tablet';

    const pageStart = Date.now();

    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || 'Direkt',
        browser,
        device,
        screenW: window.innerWidth,
      }),
    }).catch(() => {});

    // On unmount: send time spent on this page
    return () => {
      const seconds = Math.round((Date.now() - pageStart) / 1000);
      if (seconds >= 2 && seconds < 3600) {
        navigator.sendBeacon('/api/stats/duration', JSON.stringify({ page: pathname, seconds }));
      }
    };
  }, [pathname]);

  return null;
}
