import React, { useState, useEffect } from 'react';
import { Plus, X, ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { formatAngkaRibuan, parseNominal, formatRupiah } from '../utils/formatters';

export const TransactionForm = ({ isOpen, onClose, onTambahTransaksi, editingItem, onUpdateTransaksi, onMintaHapus }) => {
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [tanggal, setTanggal] = useState(getTodayString());
  const [keterangan, setKeterangan] = useState('');
  const [keteranganTambahan, setKeteranganTambahan] = useState('');
  const [jenis, setJenis] = useState('pemasukan');
  const [nominalDisplay, setNominalDisplay] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingItem) {
      setTanggal(editingItem.tanggal || getTodayString());
      setKeterangan(editingItem.keterangan || '');
      setKeteranganTambahan(
        editingItem.keteranganTambahan && editingItem.keteranganTambahan !== '-'
          ? editingItem.keteranganTambahan
          : ''
      );
      setJenis(editingItem.jenis || 'pemasukan');
      setNominalDisplay(formatAngkaRibuan(editingItem.nominal || 0));
    } else {
      setTanggal(getTodayString());
      setKeterangan('');
      setKeteranganTambahan('');
      setJenis('pemasukan');
      setNominalDisplay('');
    }
    setErrorMsg('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const nominalAngka = nominalDisplay.trim() === '' ? 0 : parseNominal(nominalDisplay);

    if (!tanggal) {
      setErrorMsg('Silakan pilih tanggal transaksi.');
      return;
    }
    if (!keterangan.trim()) {
      setErrorMsg('Keterangan transaksi wajib diisi.');
      return;
    }
    if (isNaN(nominalAngka) || nominalAngka < 0) {
      setErrorMsg('Nominal transaksi tidak valid.');
      return;
    }

    if (editingItem && onUpdateTransaksi) {
      onUpdateTransaksi({
        ...editingItem,
        tanggal,
        keterangan: keterangan.trim(),
        keteranganTambahan: keteranganTambahan.trim() || undefined,
        jenis,
        nominal: nominalAngka,
      });
    } else {
      const transaksiBaru = {
        id: `trx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        tanggal,
        keterangan: keterangan.trim(),
        keteranganTambahan: keteranganTambahan.trim() || undefined,
        jenis,
        nominal: nominalAngka,
      };
      onTambahTransaksi(transaksiBaru);
    }
    setKeteranganTambahan('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-subtle-lg border border-slate-200 dark:border-slate-800 p-5 sm:p-6 max-h-[92vh] overflow-y-auto transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              {editingItem ? (
                <Pencil className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <Plus className="w-5 h-5 stroke-[2.2]" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingItem ? 'Edit Transaksi Kas' : 'Catat Transaksi Kas'}
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {editingItem ? 'Perbarui data transaksi yang dipilih' : 'Kelas 1 Makkah SDIT AL-HAMRA'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Segmented Switcher Jenis Transaksi */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setJenis('pemasukan');
                  if (!editingItem) setNominalDisplay('');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  jenis === 'pemasukan'
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                <span>Pemasukan</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setJenis('pengeluaran');
                  if (!editingItem) setNominalDisplay('');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  jenis === 'pengeluaran'
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                <span>Pengeluaran</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Tanggal */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Tanggal
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            {/* Nominal */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Nominal (Rp)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none font-bold text-sm text-slate-400 dark:text-slate-500">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={nominalDisplay}
                  onFocus={() => {
                    if (nominalDisplay === '0') setNominalDisplay('');
                  }}
                  onChange={(e) => {
                    setNominalDisplay(formatAngkaRibuan(e.target.value));
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full pl-11 pr-3.5 py-2.5 text-sm font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Keterangan
            </label>
            <input
              type="text"
              placeholder={jenis === 'pemasukan' ? 'Contoh: Iuran kas siswa (Ahmad)' : 'Contoh: Spidol whiteboard & kertas'}
              value={keterangan}
              onChange={(e) => {
                setKeterangan(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Keterangan Tambahan (Opsional) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Keterangan Tambahan</span>
              <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 lowercase">(opsional)</span>
            </label>
            <input
              type="text"
              placeholder={jenis === 'pemasukan' ? 'Contoh: Lunas 1 Bulan (Okt) / 15 Siswa' : 'Contoh: Konsumsi Kelas / Kebersihan'}
              value={keteranganTambahan}
              onChange={(e) => setKeteranganTambahan(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 px-3.5 py-2.5 rounded-2xl">
              {errorMsg}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer ${
                jenis === 'pemasukan'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              {editingItem ? 'Simpan Perubahan' : `Simpan ${jenis === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}`}
            </button>
          </div>

          {editingItem && onMintaHapus && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  const item = editingItem;
                  onClose();
                  onMintaHapus(item);
                }}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                <span>Hapus Transaksi Ini</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
