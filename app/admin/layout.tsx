'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Sprout,
  Briefcase,
  ExternalLink,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // If on login page, don't show admin sidebar
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage) {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setUserEmail(data.user.email || 'Admin');
        }
      });
    }
  }, [isLoginPage]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: 'Dashboard Ringkasan',
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      label: 'Hero Banner & Kontak',
      href: '/admin/hero',
      icon: <ImageIcon className="w-5 h-5" />,
    },
    {
      label: 'Katalog Tanaman Hias',
      href: '/admin/products',
      icon: <Sprout className="w-5 h-5" />,
    },
    {
      label: 'Portofolio Proyek',
      href: '/admin/projects',
      icon: <Briefcase className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE2] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-brand-sand-dark/40 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="font-serif italic font-bold text-sm text-brand-earth block">
              TAMAN SAN JAYA
            </span>
            <span className="text-[10px] text-brand-earth/60 font-sans block">
              Panel Pengelola
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-brand-sand/50 text-brand-earth"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-brand-sand-dark/40 z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-brand-sand-dark/30">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 flex-shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif italic font-bold text-base text-brand-earth block">
                  TAMAN SAN JAYA
                </span>
                <span className="text-[11px] font-bold text-brand-crimson block tracking-wider">
                  ADMIN DASHBOARD
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-crimson text-white shadow-sm'
                      : 'text-brand-earth/80 hover:bg-brand-sand/50 hover:text-brand-earth'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Actions */}
        <div className="p-4 border-t border-brand-sand-dark/30 space-y-2">
          {/* View Public Website */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-brand-sand/40 hover:bg-brand-sand text-brand-earth text-xs font-semibold transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-brand-navy" />
              <span>Lihat Website Publik</span>
            </span>
          </Link>

          {/* Current User Info */}
          {userEmail && (
            <div className="px-4 py-2 flex items-center gap-2 text-xs text-brand-earth/70">
              <User className="w-3.5 h-3.5 text-brand-earth" />
              <span className="truncate">{userEmail}</span>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
