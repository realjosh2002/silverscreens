'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Ad {
  id: string;
  name: string;
  media_url: string | null;
  click_url: string | null;
}

export default function HomepageTopBanner() {
  const [ad, setAd]         = useState<Ad | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch('/api/public/advertisement?placement=Homepage Top Banner')
      .then(r => r.json())
      .then(d => {
        const payload = d.data ?? d;
        if (payload?.ad) setAd(payload.ad);
      })
      .catch(() => {});
  }, []);

  if (!ad || !visible) return null;

  const handleClick = () => {
    fetch('/api/public/advertisement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ad.id, action: 'click' }),
    }).catch(() => {});
    if (ad.click_url) window.open(ad.click_url, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'linear-gradient(90deg, #1a0800, #2d1200, #1a0800)',
      borderBottom: '1px solid rgba(212,166,74,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 24px',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, cursor: ad.click_url ? 'pointer' : 'default' }} onClick={handleClick}>
        {/* Ad label */}
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: 1,
          color: 'rgba(212,166,74,0.7)', border: '1px solid rgba(212,166,74,0.3)',
          borderRadius: 3, padding: '2px 6px', whiteSpace: 'nowrap',
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>AD</span>

        {/* Banner image if available, otherwise text */}
        {ad.media_url ? (
          <img src={ad.media_url} alt={ad.name}
            style={{ height: 36, objectFit: 'contain', borderRadius: 4 }} />
        ) : (
          <span style={{
            fontSize: 15, fontWeight: 600,
            color: '#F5F5F5',
            fontFamily: "'Barlow Condensed', sans-serif",
          }}>{ad.name}</span>
        )}
      </div>

      {/* Close button */}
      <button onClick={() => setVisible(false)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex',
        alignItems: 'center', flexShrink: 0,
      }}>
        <X size={14} />
      </button>
    </div>
  );
}