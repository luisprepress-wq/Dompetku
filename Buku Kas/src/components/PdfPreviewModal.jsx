import React from 'react';
import { X, Download, FileText } from 'lucide-react';

export const PdfPreviewModal = ({
  isOpen,
  onClose,
  onDownload,
  previewData,
  currentAccent,
}) => {
  if (!isOpen || !previewData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-100 transition-colors">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold shrink-0"
              style={{ backgroundColor: currentAccent?.color || '#2563EB' }}
            >
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                Preview Laporan Kas PDF
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {previewData.periodeText} &bull; Kelas 1 Makkah SDIT AL-HAMRA
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center font-bold transition active:scale-95 cursor-pointer ml-2"
            title="Tutup Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Preview Frame */}
        <div className="flex-1 p-2 sm:p-4 bg-slate-100 dark:bg-slate-950/60 overflow-hidden flex flex-col min-h-0">
          <iframe
            src={previewData.blobUrl}
            className="w-full flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white shadow-xs min-h-[58vh] sm:min-h-[68vh]"
            title="Preview PDF Laporan Kas"
          />
          <div className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500 sm:hidden">
            Jika preview PDF tidak otomatis tampil di peramban HP, Anda dapat{' '}
            <a
              href={previewData.blobUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 font-semibold underline"
            >
              Buka di Tab Baru
            </a>{' '}
            atau unduh langsung dengan tombol di bawah.
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-3 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onDownload();
              onClose();
            }}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md active:scale-95 transition cursor-pointer ${
              currentAccent?.btn || 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Download className="w-4 h-4 stroke-[2.4]" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
