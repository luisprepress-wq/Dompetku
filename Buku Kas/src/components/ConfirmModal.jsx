import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, transaksi }) => {
  if (!isOpen || !transaksi) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
          <Trash2 className="w-5 h-5 stroke-[2.2]" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
          Hapus Transaksi?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Tindakan ini tidak dapat dibatalkan:
        </p>
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 mb-4 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400 dark:text-slate-500">Keterangan:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[170px]">{transaksi.keterangan}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 dark:text-slate-500">Nominal:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{formatRupiah(transaksi.nominal)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(transaksi.id);
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};
