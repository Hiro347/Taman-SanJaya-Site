'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldAlert, Clock } from 'lucide-react';

const MAX_ATTEMPTS = 5;
const BASE_LOCKOUT_SECONDS = 60; // 1 menit

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Rate Limiter State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Inisialisasi status rate limiter dari localStorage saat mount
  useEffect(() => {
    try {
      const storedAttempts = parseInt(localStorage.getItem('tsj_admin_attempts') || '0', 10);
      const storedLockout = localStorage.getItem('tsj_admin_lockout_until');

      setFailedAttempts(storedAttempts);

      if (storedLockout) {
        const lockoutTime = parseInt(storedLockout, 10);
        const now = Date.now();
        if (lockoutTime > now) {
          setLockoutRemaining(Math.ceil((lockoutTime - now) / 1000));
        } else {
          localStorage.removeItem('tsj_admin_lockout_until');
        }
      }
    } catch {
      // Abaikan jika localStorage dibatasi browser
    }
  }, []);

  // Timer countdown hitung mundur saat terkunci
  useEffect(() => {
    if (lockoutRemaining <= 0) return;

    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('tsj_admin_lockout_until');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Jika sedang dalam masa lockout, tolak submit
    if (lockoutRemaining > 0) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        localStorage.setItem('tsj_admin_attempts', newAttempts.toString());

        // Jika mencapai atau melebihi batas maksimal percobaan
        if (newAttempts >= MAX_ATTEMPTS) {
          // Kunci progresif: 60s untuk 5x gagal, 120s untuk 6x, maks 300s
          const multiplier = Math.min(newAttempts - MAX_ATTEMPTS + 1, 5);
          const lockoutDuration = BASE_LOCKOUT_SECONDS * multiplier;
          const lockoutUntil = Date.now() + lockoutDuration * 1000;

          localStorage.setItem('tsj_admin_lockout_until', lockoutUntil.toString());
          setLockoutRemaining(lockoutDuration);
          setErrorMsg(
            `Terlalu banyak percobaan gagal (${newAttempts}x). Form login dikunci sementara selama ${lockoutDuration} detik demi keamanan.`
          );
        } else {
          const sisaKesempatan = MAX_ATTEMPTS - newAttempts;
          setErrorMsg(
            `Email atau password salah. (Sisa ${sisaKesempatan} kesempatan sebelum form dikunci sementara)`
          );
        }

        setLoading(false);
        return;
      }

      if (data.session) {
        // Login berhasil: Bersihkan riwayat percobaan gagal
        localStorage.removeItem('tsj_admin_attempts');
        localStorage.removeItem('tsj_admin_lockout_until');
        router.push('/gate-sanjaya-admin');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat masuk.');
      setLoading(false);
    }
  };

  const isLockedOut = lockoutRemaining > 0;

  return (
    <div className="min-h-screen bg-brand-sand/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-brand-sand-dark/40">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="relative w-14 h-14 mx-auto mb-3">
            <Image
              src="/images/logo.png"
              alt="Taman San Jaya Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="font-serif italic font-bold text-2xl text-brand-earth">
            TAMAN SAN JAYA
          </h1>
          <p className="text-xs text-brand-earth/70 tracking-widest font-sans mt-0.5">
            成功之园 • PORTAL ADMIN
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 bg-brand-sand/60 px-3 py-1 rounded-full text-xs font-semibold text-brand-earth">
            <Lock className="w-3.5 h-3.5 text-brand-crimson" />
            <span>Masuk untuk mengelola website</span>
          </div>
        </div>

        {/* Lockout Warning Banner */}
        {isLockedOut ? (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3 shadow-xs">
            <Clock className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 animate-pulse" />
            <div>
              <p className="font-bold text-sm text-amber-950">
                Akses Login Dikunci Sementara
              </p>
              <p className="mt-1 leading-relaxed">
                Terlalu banyak percobaan sandi yang salah ({failedAttempts}x). Silakan tunggu hitung mundur di bawah ini sebelum mencoba lagi.
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200/80 rounded-lg font-mono font-bold text-xs text-amber-900">
                <span>Waktu Tunggu: {lockoutRemaining} detik</span>
              </div>
            </div>
          </div>
        ) : (
          errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
              Email Admin
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-earth/50" />
              <input
                type="email"
                required
                disabled={loading || isLockedOut}
                placeholder="admin@tamansanjaya.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-earth uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-earth/50" />
              <input
                type="password"
                required
                disabled={loading || isLockedOut}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isLockedOut}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover disabled:bg-gray-400 text-white font-bold py-3.5 px-6 rounded-lg shadow-md transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Memproses Masuk...</span>
            ) : isLockedOut ? (
              <span>Terkunci Sementara ({lockoutRemaining}s)</span>
            ) : (
              <>
                <span>Masuk Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-brand-earth/70">
          <ShieldAlert className="w-3.5 h-3.5 text-brand-navy" />
          <span>Dilindungi proteksi anti brute-force rate limiter</span>
        </div>

        {/* Informative Note for Supabase Setup */}
        <div className="mt-6 pt-6 border-t border-brand-sand-dark/30 text-center">
          <p className="text-xs text-brand-earth/60">
            Akun admin dibuat langsung melalui menu <strong>Authentication</strong> di Dashboard Supabase.
          </p>
          <a
            href="/"
            className="inline-block mt-3 text-xs font-semibold text-brand-navy hover:underline"
          >
            ← Kembali ke Website Utama
          </a>
        </div>

      </div>
    </div>
  );
}
