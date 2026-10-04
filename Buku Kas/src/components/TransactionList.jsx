import React from 'react';
import { ArrowDownLeft, ArrowUpRight, FolderOpen, Plus, Wallet, ChevronRight } from 'lucide-react';
import { formatRupiah, formatTanggal } from '../utils/formatters';

export const TransactionList = ({
  transaksi,
  onMintaHapus,
  onMintaEdit,
  onBukaTambah,
  saldoBulanSebelumnya = 0,
  namaBulanSebelumnya = '',
  selectedMonth = 'all',
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-subtle p-3.5 sm:p-5 transition-colors">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
            Riwayat Transaksi
          </h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {transaksi.length} transaksi pada periode ini
          </p>
        </div>
      </div>

      {transaksi.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 mb-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Belum Ada Transaksi</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mb-3.5">
            Belum ada catatan keuangan kas di periode yang dipilih.
          </p>
          <button
            type="button"
            onClick={onBukaTambah}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-subtle hover:bg-blue-700 active:scale-95 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Transaksi Baru</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* Banner Saldo Kas Bulan Sebelumnya (Di-block Orange) */}
          {saldoBulanSebelumnya > 0 && selectedMonth !== 'all' && (
            <div className="w-full bg-orange-50/90 dark:bg-orange-950/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-orange-300 dark:border-orange-600/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-left">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 bg-orange-500 text-white font-bold shadow-xs">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-200 dark:bg-orange-900/80 text-orange-900 dark:text-orange-200">
                      Saldo Kas Bulan Lalu
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-orange-700 dark:text-orange-300 font-semibold">
                      {namaBulanSebelumnya}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-orange-950 dark:text-orange-100 mt-0.5 truncate sm:truncate-none">
                    Sisa Saldo Kas Bulan Sebelumnya ({namaBulanSebelumnya})
                  </p>
                </div>
              </div>
              <div className="flex sm:block items-center justify-between pt-1 sm:pt-0 border-t sm:border-t-0 border-orange-200/60 dark:border-orange-900/40 text-right sm:shrink-0">
                <span className="text-[11px] text-orange-700 dark:text-orange-300 font-medium sm:hidden">Nominal:</span>
                <span className="text-xs sm:text-sm font-extrabold text-orange-700 dark:text-orange-400">
                  + {formatRupiah(saldoBulanSebelumnya)}
                </span>
              </div>
            </div>
          )}

          {[...transaksi]
            .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
            .map((item) => {
              const isMasuk = item.jenis === 'pemasukan';
              const isAwal = item.isSaldoAwal || (item.keterangan && (item.keterangan.toLowerCase().includes('saldo awal') || item.keterangan.toLowerCase().includes('sisa uang kas')));
              return (
                <div
                  key={item.id}
                  onClick={() => onMintaEdit && onMintaEdit(item)}
                  className={`w-full bg-white dark:bg-slate-800/80 p-3 sm:p-4 rounded-xl sm:rounded-2xl border shadow-subtle hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md active:scale-[0.99] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-left group cursor-pointer ${
                    isAwal
                      ? 'border-orange-300 dark:border-orange-700/70 bg-orange-50/20 dark:bg-orange-950/20'
                      : 'border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  {/* Bagian Utama (Atas di HP, Kiri di Desktop) */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${
                          isAwal
                            ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/60'
                            : isMasuk
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/60'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60'
                        }`}
                      >
                        {isMasuk ? (
                          <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug truncate">
                          {item.keterangan}
                        </p>
                        
                        {/* Meta tanggal & label untuk tampilan Desktop */}
                        <div className="hidden sm:flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            {formatTanggal(item.tanggal)}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                              isMasuk
                                ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {item.jenis}
                          </span>
                          {isAwal && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider bg-orange-100 dark:bg-orange-900/70 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                              Saldo Awal
                            </span>
                          )}
                          {item.keteranganTambahan && item.keteranganTambahan !== '-' && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md font-medium">
                              {item.keteranganTambahan}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Nominal & Chevron pada HP */}
                    <div className="sm:hidden flex items-center gap-1.5 text-right shrink-0">
                      <span
                        className={`text-xs font-extrabold tracking-tight ${
                          item.nominal === 0
                            ? 'text-slate-600 dark:text-slate-300'
                            : isMasuk
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {item.nominal === 0 ? formatRupiah(0) : `${isMasuk ? '+' : '-'} ${formatRupiah(item.nominal)}`}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Bagian Bawah Khusus HP (Tanggal, Badge, Keterangan Tambahan & Tombol Aksi) */}
                  <div className="flex sm:hidden items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {formatTanggal(item.tanggal)}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          isMasuk
                            ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {item.jenis}
                      </span>
                      {isAwal && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase bg-orange-100 dark:bg-orange-900/70 text-orange-800 dark:text-orange-300">
                          Saldo Awal
                        </span>
                      )}
                      {item.keteranganTambahan && item.keteranganTambahan !== '-' && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded truncate max-w-[170px]">
                          {item.keteranganTambahan}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bagian Kanan Khusus Desktop (Nominal & Chevron) */}
                  <div className="hidden sm:flex items-center gap-2.5 shrink-0 text-right">
                    <span
                      className={`text-sm font-extrabold tracking-tight ${
                        item.nominal === 0
                          ? 'text-slate-600 dark:text-slate-300'
                          : isMasuk
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.nominal === 0 ? formatRupiah(0) : `${isMasuk ? '+' : '-'} ${formatRupiah(item.nominal)}`}
                    </span>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all">
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
