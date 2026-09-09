'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Three.js 3D Logo component with SSR disabled
const ScrollRotatingLogo3D = dynamic(
  () => import('@/components/ScrollRotatingLogo3D'),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function ScrollRotatingLogoWrapper() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    // 1. If user is already scrolled down (e.g. page refresh or direct anchor link)
    if (window.scrollY > 30) {
      setShouldMount(true);
      return;
    }

    // 2. Trigger load on user's first scroll/touch intent
    const onUserInteraction = () => {
      setShouldMount(true);
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('scroll', onUserInteraction);
      window.removeEventListener('wheel', onUserInteraction);
      window.removeEventListener('touchmove', onUserInteraction);
    };

    window.addEventListener('scroll', onUserInteraction, { passive: true });
    window.addEventListener('wheel', onUserInteraction, { passive: true });
    window.addEventListener('touchmove', onUserInteraction, { passive: true });

    // 3. Fallback: If user stays reading the Hero section for >3.5s,
    // preload quietly in the background during browser idle time
    const idleTimer = setTimeout(() => {
      setShouldMount(true);
      cleanup();
    }, 3500);

    return () => {
      cleanup();
      clearTimeout(idleTimer);
    };
  }, []);

  if (!shouldMount) return null;

  return <ScrollRotatingLogo3D />;
}
