import React from 'react';
import { FileDown, ChevronDown } from 'lucide-react';
import { DAFTAR_BULAN } from '../utils/formatters';

export const FilterBar = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  availableYears,
  onResetFilter,
  onEksporPDF,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-subtle transition-colors">
      {/* Filter Controls (Grid 2 kolom di HP agar presisi dan rapi) */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-2.5 sm:px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer"
          >
            <option value="all">Semua Bulan</option>
            {DAFTAR_BULAN.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full text-xs sm:text-sm font-semibold bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-2.5 sm:px-3 py-2 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none cursor-pointer"
          >
            {availableYears.map((th) => (
              <option key={th} value={th}>
                Tahun {th}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {selectedMonth !== 'all' && (
          <button
            type="button"
            onClick={onResetFilter}
            className="col-span-2 sm:col-auto w-full sm:w-auto text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-xl transition cursor-pointer text-center"
            title="Tampilkan Total Saldo Keseluruhan"
          >
            Total Saldo
          </button>
        )}
      </div>

      {/* Ekspor PDF Button */}
      <button
        type="button"
        onClick={onEksporPDF}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-subtle active:scale-[0.98] transition cursor-pointer"
        title="Buka Preview & Ekspor Laporan PDF"
      >
        <FileDown className="w-4 h-4 stroke-[2.2]" />
        <span>Preview & Ekspor PDF</span>
      </button>
    </div>
  );
};
