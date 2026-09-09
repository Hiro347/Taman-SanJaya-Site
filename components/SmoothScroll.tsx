'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Inisialisasi Lenis Smooth Scroll untuk momentum scroll sekelas website Awwwards
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Menyimpan instance lenis ke window agar modal dapat memanggil lenis.stop() / lenis.start()
    if (typeof window !== 'undefined') {
      (window as unknown as { lenis?: Lenis }).lenis = lenis;
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (typeof window !== 'undefined') {
        delete (window as unknown as { lenis?: Lenis }).lenis;
      }
    };
  }, []);

  return <>{children}</>;
}
