'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const homeScrollPosRef = useRef<number>(0);
  const isHomepageRef = useRef<boolean>(pathname === '/');

  useEffect(() => {
    isHomepageRef.current = pathname === '/';
  }, [pathname]);

  useEffect(() => {
    // Inisialisasi Lenis Smooth Scroll dengan pembatasan kecepatan maksimum (Anti-Lag & Anti-Flicker)
    const lenis = new Lenis({
      duration: 1.0, // Dioptimasi dari 1.2 agar scroll lebih responsif dan momentum tidak menumpuk berlebih
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85, // Mencegah lonjakan scroll yang terlalu agresif pada mouse wheel
      touchMultiplier: 1.0,  // Standar 1.0 pada layar sentuh agar tidak melesat kencang saat di-swipe
      // Batasi kecepatan scroll maksimum per tick dan cegah runaway accumulation
      virtualScroll: (data) => {
        // 1. Batasi delta maksimum per event scroll agar tidak ada lonjakan pixel instan yang ekstrem
        const MAX_TICK_DELTA = 90;
        if (Math.abs(data.deltaY) > MAX_TICK_DELTA) {
          data.deltaY = Math.sign(data.deltaY) * MAX_TICK_DELTA;
        }

        // 2. Batasi akumulasi jarak target terhadap posisi scroll aktif (mencegah scroll terbang terlalu jauh)
        const activeLenis = lenisRef.current as (Lenis & { targetScroll?: number }) | null;
        if (activeLenis && typeof activeLenis.targetScroll === 'number') {
          const distanceAhead = Math.abs(activeLenis.targetScroll - activeLenis.scroll);
          const MAX_AHEAD_DISTANCE = 320; // Batas toleransi jarak target di depan posisi render

          if (distanceAhead > MAX_AHEAD_DISTANCE) {
            const dampingFactor = Math.max(0.1, 1 - (distanceAhead - MAX_AHEAD_DISTANCE) / 200);
            data.deltaY *= dampingFactor;
          }
        }

        return true;
      },
    });
    lenisRef.current = lenis;

    // Simpan posisi scroll saat pengunjung berselancar di homepage
    lenis.on('scroll', (e: { scroll: number }) => {
      if (isHomepageRef.current) {
        homeScrollPosRef.current = e.scroll;
      }
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Menyimpan instance lenis ke window agar modal / navbar dapat memanggil lenis
    if (typeof window !== 'undefined') {
      (window as unknown as { lenis?: Lenis }).lenis = lenis;
    }

    // Intercept klik link anchor internal (#...) agar scroll meluncur halus via Lenis
    const handleAnchorClick = (e: MouseEvent) => {
      // Hanya proses klik kiri tanpa tombol modifier
      if (e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;

      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;

      const targetId = href.substring(1);

      // Jika target adalah home, scroll halus ke puncak halaman
      if (targetId === 'home') {
        e.preventDefault();
        lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        history.pushState(null, '', '#home');
        return;
      }

      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        lenis.scrollTo(targetElement, {
          offset: -25,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        history.pushState(null, '', href);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        delete (window as unknown as { lenis?: Lenis }).lenis;
      }
    };
  }, []);

  // Menangani transisi perpindahan halaman / rute
  useEffect(() => {
    const lenis = lenisRef.current;

    if (pathname !== '/') {
      // 1. Saat berpindah ke halaman detail (/proyek/* atau /katalog/*):
      // SELALU pastikan halaman dimulai dari posisi PALING ATAS
      window.scrollTo(0, 0);
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
    } else {
      // 2. Saat kembali ke homepage (/):
      // Pertahankan posisi terakhir di mana pengunjung berada di homepage
      const hash = typeof window !== 'undefined' ? window.location.hash : '';

      const restoreScroll = () => {
        if (hash) {
          const targetId = hash.replace('#', '');
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            if (lenis) {
              lenis.scrollTo(targetElement, { offset: -25, immediate: true });
            } else {
              targetElement.scrollIntoView();
            }
            return;
          }
        }

        if (homeScrollPosRef.current > 0) {
          if (lenis) {
            lenis.scrollTo(homeScrollPosRef.current, { immediate: true });
          } else {
            window.scrollTo(0, homeScrollPosRef.current);
          }
        }
      };

      // Jalankan pemulihan scroll setelah frame render homepage siap
      const timer = setTimeout(restoreScroll, 50);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return <>{children}</>;
}
