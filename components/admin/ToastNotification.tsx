'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastData {
  type: 'success' | 'error';
  text: string;
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
  duration?: number; // Durasi dalam milidetik sebelum otomatis menutup (default: 3000ms = 3 detik)
}

export default function ToastNotification({
  toast,
  onClose,
  duration = 3000,
}: ToastNotificationProps) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 border shadow-xs transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
        isSuccess
          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
          : 'bg-red-50 text-red-900 border-red-200'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        )}
        <span className="font-semibold truncate">{toast.text}</span>
      </div>

      {/* Tombol X untuk menutup seketika */}
      <button
        type="button"
        onClick={onClose}
        className={`p-1 rounded-lg transition-colors flex-shrink-0 cursor-pointer ${
          isSuccess
            ? 'text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100/70'
            : 'text-red-700 hover:text-red-950 hover:bg-red-100/70'
        }`}
        aria-label="Tutup notifikasi"
        title="Tutup notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
