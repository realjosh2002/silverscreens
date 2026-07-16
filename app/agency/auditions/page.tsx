'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuditionManagementIndexPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/agency/auditions/management');
  }, [router]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#050505', color: 'rgba(255,255,255,0.4)', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16 }}>
      Loading Audition Management...
    </div>
  );
}