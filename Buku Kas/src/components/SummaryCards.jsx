import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export const SummaryCards = ({ totalPemasukan, totalPengeluaran, saldoAkhir, filterLabel, gradient, saldoBulanSebelumnya = 0, selectedMonth = 'all' }) => {
  const bgGradient = gradient || 'from-blue-600 via-blue-600 to-indigo-700';
  return (
    <div className={`bg-gradient-to-br ${bgGradient} text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-subtle-lg relative overflow-hidden transition-all duration-300`}>
      {/* Background Shapes */}
      <div className="absolute -right-8 -top-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-medium text-blue-100/90 truncate">
              Saldo Kas Saat Ini
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white backdrop-blur-md border border-white/20 shrink-0">
              {filterLabel}
            </span>
          </div>
          {saldoAkhir < 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shrink-0">
              Defisit
            </span>
          )}
        </div>

        {/* Big Balance Number */}
        <div className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 sm:mb-5">
          {formatRupiah(saldoAkhir)}
        </div>

        {/* Dual Glass Sub-Cards */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
          {/* Pemasukan Sub-Card */}
          <div className="bg-white/15 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 transition hover:bg-white/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-emerald-400/30 flex items-center justify-center text-emerald-200 shrink-0">
                  <ArrowDownLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-[11px] sm:text-xs text-blue-100 font-medium">Pemasukan</span>
              </div>
              <p className="text-xs sm:text-base font-extrabold text-white tracking-tight truncate">
                {formatRupiah(totalPemasukan)}
              </p>
            </div>
            {saldoBulanSebelumnya > 0 && selectedMonth !== 'all' && (
              <span className="text-[9px] sm:text-[10px] text-emerald-200 block font-normal mt-1 leading-tight opacity-90 truncate">
                Termasuk saldo lalu ({formatRupiah(saldoBulanSebelumnya)})
              </span>
            )}
          </div>

          {/* Pengeluaran Sub-Card */}
          <div className="bg-white/15 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 transition hover:bg-white/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md sm:rounded-lg bg-rose-400/30 flex items-center justify-center text-rose-200 shrink-0">
                  <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </div>
                <span className="text-[11px] sm:text-xs text-blue-100 font-medium">Pengeluaran</span>
              </div>
              <p className="text-xs sm:text-base font-extrabold text-white tracking-tight truncate">
                {formatRupiah(totalPengeluaran)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
