import React, { useState } from 'react';
import { Wallet, Plus, Moon, Sun, Check, RotateCw } from 'lucide-react';

export const Header = ({
  onOpenAddModal,
  isDark,
  onToggleTheme,
  accent,
  onSelectAccent,
  accents = [],
  currentAccent,
}) => {
  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) {
            registration.update();
          }
        });
      }
      setTimeout(() => {
        window.location.reload();
      }, 250);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-4xl mx-auto px-2.5 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* App Identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md shrink-0 transition-colors"
            style={{ backgroundColor: currentAccent?.color || '#2563EB' }}
          >
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <div className="min-w-0 pr-1">
            <h1 className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight leading-tight truncate">
              Buku Kas
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 leading-tight break-normal sm:truncate">
              Kelas 1 Makkah - SDIT AL-HAMRA
            </p>
          </div>
        </div>

        {/* Action Buttons Right */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Tombol Refresh Aplikasi */}
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
            title="Segarkan / Refresh Aplikasi"
          >
            <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] ${isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Pilihan Aksen Warna Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAccentPicker(!showAccentPicker)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
              title="Pilih Aksen Warna"
            >
              <span
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full shadow-xs shrink-0"
                style={{ backgroundColor: currentAccent?.color || '#2563EB' }}
              />
              <span className="hidden sm:inline">Aksen</span>
            </button>

            {showAccentPicker && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-slate-800 rounded-2xl shadow-subtle-lg border border-slate-200 dark:border-slate-700 p-2 z-50 animate-fade-in">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1">
                  Pilih Aksen
                </div>
                <div className="space-y-1">
                  {accents.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectAccent(item.id);
                        setShowAccentPicker(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        accent === item.id
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                      {accent === item.id && <Check className="w-3.5 h-3.5 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tombol Mode Gelap / Terang */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold transition active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
            title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span className="hidden sm:inline">Gelap</span>
              </>
            )}
          </button>

          {/* Tombol Catat Transaksi */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 p-1.5 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl text-white text-xs font-bold shadow-md active:scale-95 transition cursor-pointer ${
              currentAccent?.btn || 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
            title="Catat Transaksi"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Catat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
