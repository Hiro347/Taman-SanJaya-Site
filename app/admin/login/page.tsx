'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg('Email atau password salah. Silakan periksa kembali akun admin Anda.');
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat masuk.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-sand/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-brand-sand-dark/40">
        
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

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
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
                placeholder="admin@tamansanjaya.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-sand-dark/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-crimson/50 text-brand-earth"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-brand-crimson hover:bg-brand-crimson-hover disabled:bg-gray-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-colors"
          >
            {loading ? (
              <span>Memproses Masuk...</span>
            ) : (
              <>
                <span>Masuk Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Informative Note for Supabase Setup */}
        <div className="mt-8 pt-6 border-t border-brand-sand-dark/30 text-center">
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
