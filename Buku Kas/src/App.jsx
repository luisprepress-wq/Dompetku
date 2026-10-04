import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { FilterBar } from './components/FilterBar';
import { TransactionList } from './components/TransactionList';
import { ConfirmModal } from './components/ConfirmModal';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { eksporLaporanKasPDF } from './utils/pdfExport';
import { getNamaBulan } from './utils/formatters';

const STORAGE_KEY = 'buku_kas_makkah_v3';

const INITIAL_TRANSACTIONS = [
  // === TRANSAKSI BULAN OKTOBER 2026 ===
  {
    id: 'trx-okt-1',
    tanggal: '2026-10-02',
    keterangan: 'Iuran kas Oktober - Diwang',
    jenis: 'pemasukan',
    nominal: 20000,
    keteranganTambahan: 'Lunas 1 Bulan (Okt)',
  },
  {
    id: 'trx-okt-2',
    tanggal: '2026-10-02',
    keterangan: 'Iuran kas 3 bulan (Oktober - Desember) - Kavandra',
    jenis: 'pemasukan',
    nominal: 60000,
    keteranganTambahan: 'Lunas 3 Bulan (Okt - Des)',
  },
  {
    id: 'trx-okt-3',
    tanggal: '2026-10-02',
    keterangan: 'Iuran kas Oktober - Athalla',
    jenis: 'pemasukan',
    nominal: 20000,
    keteranganTambahan: 'Lunas 1 Bulan (Okt)',
  },
  {
    id: 'trx-okt-4',
    tanggal: '2026-10-02',
    keterangan: 'Iuran kas Oktober - Rayhan',
    jenis: 'pemasukan',
    nominal: 20000,
    keteranganTambahan: 'Lunas 1 Bulan (Okt)',
  },

  // === TRANSAKSI BULAN SEPTEMBER 2026 ===
  // PEMASUKAN (Total: Rp 782.000)
  {
    id: 'trx-sep-1',
    tanggal: '2026-09-01',
    keterangan: 'Sisa uang kas (Saldo awal)',
    jenis: 'pemasukan',
    nominal: 382000,
    isSaldoAwal: true,
    keteranganTambahan: 'Saldo Awal Kas',
  },
  {
    id: 'trx-sep-2',
    tanggal: '2026-09-05',
    keterangan: '15x 20 (Iuran kas)',
    jenis: 'pemasukan',
    nominal: 300000,
    keteranganTambahan: '15 Siswa',
  },
  {
    id: 'trx-sep-3',
    tanggal: '2026-09-08',
    keterangan: 'Gavin 5 bulan (September - Januari)',
    jenis: 'pemasukan',
    nominal: 100000,
    keteranganTambahan: 'Sept - Jan (5 Bln)',
  },

  // PENGELUARAN (Total: Rp 322.000)
  {
    id: 'trx-sep-4',
    tanggal: '2026-09-10',
    keterangan: 'Air galon',
    jenis: 'pengeluaran',
    nominal: 43000,
    keteranganTambahan: 'Konsumsi Kelas',
  },
  {
    id: 'trx-sep-5',
    tanggal: '2026-09-12',
    keterangan: 'Tisu',
    jenis: 'pengeluaran',
    nominal: 16000,
    keteranganTambahan: 'Kebersihan',
  },
  {
    id: 'trx-sep-6',
    tanggal: '2026-09-15',
    keterangan: 'Kekurangan patungan 17 Agustus',
    jenis: 'pengeluaran',
    nominal: 34000,
    keteranganTambahan: 'Kegiatan HUT RI',
  },
  {
    id: 'trx-sep-7',
    tanggal: '2026-09-18',
    keterangan: 'Air galon Juli',
    jenis: 'pengeluaran',
    nominal: 22000,
    keteranganTambahan: 'Reimburse Juli',
  },
  {
    id: 'trx-sep-8',
    tanggal: '2026-09-22',
    keterangan: 'Air galon',
    jenis: 'pengeluaran',
    nominal: 22000,
    keteranganTambahan: 'Konsumsi Kelas',
  },
  {
    id: 'trx-sep-9',
    tanggal: '2026-09-26',
    keterangan: 'Lain-lain',
    jenis: 'pengeluaran',
    nominal: 185000,
    keteranganTambahan: 'Operasional Kelas',
  },
];

const THEME_ACCENTS = [
  { id: 'blue', name: 'Biru', color: '#2563EB', gradient: 'from-blue-600 via-blue-600 to-indigo-700', btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' },
  { id: 'emerald', name: 'Hijau', color: '#059669', gradient: 'from-emerald-600 via-emerald-600 to-teal-700', btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' },
  { id: 'purple', name: 'Ungu', color: '#7C3AED', gradient: 'from-purple-600 via-violet-600 to-indigo-700', btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20' },
  { id: 'orange', name: 'Oranye', color: '#EA580C', gradient: 'from-orange-600 via-amber-600 to-rose-600', btn: 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/20' },
];

export function App() {
  // Bersihkan data lama v1 dan v2 jika ada
  try {
    localStorage.removeItem('buku_kas_makkah_v1');
    localStorage.removeItem('buku_kas_makkah_v2');
  } catch (e) {}

  const [transaksi, setTransaksi] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transaksi));
    } catch (e) {
      console.error(e);
    }
  }, [transaksi]);

  // State Mode Gelap / Terang
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem('buku_kas_theme') === 'dark';
    } catch (e) {
      return false;
    }
  });

  // State Pilihan Aksen Warna
  const [accent, setAccent] = useState(() => {
    try {
      return localStorage.getItem('buku_kas_accent') || 'blue';
    } catch (e) {
      return 'blue';
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('buku_kas_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('buku_kas_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    try {
      localStorage.setItem('buku_kas_accent', accent);
    } catch (e) {}
  }, [accent]);

  const currentAccent = THEME_ACCENTS.find((a) => a.id === accent) || THEME_ACCENTS[0];

  const currentMonth = '10'; // Default ke bulan Oktober
  const currentYear = '2026';

  const [selectedMonth, setSelectedMonth] = useState('10');
  const [selectedYear, setSelectedYear] = useState('2026');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const availableYears = useMemo(() => {
    const years = new Set([currentYear]);
    transaksi.forEach((t) => {
      if (t.tanggal) {
        const y = t.tanggal.split('-')[0];
        if (y) years.add(y);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [transaksi, currentYear]);

  const transaksiDifilter = useMemo(() => {
    return transaksi.filter((t) => {
      if (!t.tanggal) return false;
      const [year, month] = t.tanggal.split('-');
      const matchYear = String(year) === String(selectedYear);
      const matchMonth = selectedMonth === 'all' || String(parseInt(month, 10)) === String(selectedMonth);
      return matchYear && matchMonth;
    });
  }, [transaksi, selectedMonth, selectedYear]);

  // Saldo bulan sebelumnya jika memilih bulan spesifik
  const { saldoBulanSebelumnya, namaBulanSebelumnya } = useMemo(() => {
    if (selectedMonth === 'all') {
      return { saldoBulanSebelumnya: 0, namaBulanSebelumnya: '' };
    }
    const bulanInt = parseInt(selectedMonth, 10);
    const tahunInt = parseInt(selectedYear, 10);
    let prevBulanInt = bulanInt - 1;
    let prevTahunInt = tahunInt;
    if (prevBulanInt < 1) {
      prevBulanInt = 12;
      prevTahunInt = tahunInt - 1;
    }
    const namaBulanPrev = `${getNamaBulan(prevBulanInt)} ${prevTahunInt}`;

    const cutOffDate = new Date(tahunInt, bulanInt - 1, 1);
    let saldoSebelum = 0;
    transaksi.forEach((t) => {
      if (!t.tanggal) return;
      const tDate = new Date(t.tanggal);
      if (tDate < cutOffDate) {
        const nom = Number(t.nominal) || 0;
        if (t.jenis === 'pemasukan') saldoSebelum += nom;
        else if (t.jenis === 'pengeluaran') saldoSebelum -= nom;
      }
    });
    return {
      saldoBulanSebelumnya: saldoSebelum,
      namaBulanSebelumnya: namaBulanPrev,
    };
  }, [transaksi, selectedMonth, selectedYear]);

  const { totalPemasukan, totalPengeluaran, saldoAkhir, pemasukanBulanIni } = useMemo(() => {
    let masuk = 0;
    let keluar = 0;
    transaksiDifilter.forEach((t) => {
      const nom = Number(t.nominal) || 0;
      if (t.jenis === 'pemasukan') masuk += nom;
      else if (t.jenis === 'pengeluaran') keluar += nom;
    });
    const totalMasuk = masuk + saldoBulanSebelumnya;
    const totalKeluar = keluar;
    return {
      pemasukanBulanIni: masuk,
      totalPemasukan: totalMasuk,
      totalPengeluaran: totalKeluar,
      saldoAkhir: totalMasuk - totalKeluar,
    };
  }, [transaksiDifilter, saldoBulanSebelumnya]);

  const handleBukaTambah = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleBukaEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleTambahTransaksi = (transaksiBaru) => {
    setTransaksi((prev) => [transaksiBaru, ...prev]);
    if (transaksiBaru.tanggal) {
      const [y, m] = transaksiBaru.tanggal.split('-');
      setSelectedYear(y);
      setSelectedMonth(String(parseInt(m, 10)));
    }
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleUpdateTransaksi = (transaksiDiupdate) => {
    setTransaksi((prev) =>
      prev.map((t) => (t.id === transaksiDiupdate.id ? transaksiDiupdate : t))
    );
    if (transaksiDiupdate.tanggal) {
      const [y, m] = transaksiDiupdate.tanggal.split('-');
      setSelectedYear(y);
      setSelectedMonth(String(parseInt(m, 10)));
    }
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleHapusTransaksi = (id) => {
    setTransaksi((prev) => prev.filter((t) => t.id !== id));
  };

  const filterLabel =
    selectedMonth === 'all'
      ? `Semua Bulan ${selectedYear}`
      : `${getNamaBulan(selectedMonth)} ${selectedYear}`;

  const handleEksporPDF = () => {
    if (pdfPreview && pdfPreview.blobUrl) {
      URL.revokeObjectURL(pdfPreview.blobUrl);
    }
    const result = eksporLaporanKasPDF({
      transaksi: transaksiDifilter,
      semuaTransaksi: transaksi,
      bulan: selectedMonth,
      tahun: selectedYear,
      saldoBulanSebelumnya,
      totalPemasukan,
      totalPengeluaran,
      saldoAkhir,
    });
    setPdfPreview(result);
  };

  const handleClosePdfPreview = () => {
    if (pdfPreview && pdfPreview.blobUrl) {
      URL.revokeObjectURL(pdfPreview.blobUrl);
    }
    setPdfPreview(null);
  };

  const handleDownloadPdf = () => {
    if (pdfPreview && pdfPreview.doc) {
      pdfPreview.doc.save(pdfPreview.filename);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Header ala DompetKu dengan Tombol Aksen & Dark Mode */}
      <Header
        onOpenAddModal={handleBukaTambah}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        accent={accent}
        onSelectAccent={setAccent}
        accents={THEME_ACCENTS}
        currentAccent={currentAccent}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 pb-24 sm:pb-8 space-y-4 sm:space-y-5">
        {/* Signature DompetKu Gradient Hero Card */}
        <SummaryCards
          totalPemasukan={totalPemasukan}
          totalPengeluaran={totalPengeluaran}
          saldoAkhir={saldoAkhir}
          filterLabel={filterLabel}
          gradient={currentAccent.gradient}
          saldoBulanSebelumnya={saldoBulanSebelumnya}
          selectedMonth={selectedMonth}
        />

        {/* Filter Bar & Tombol Ekspor PDF */}
        <FilterBar
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          availableYears={availableYears}
          onResetFilter={() => setSelectedMonth('all')}
          onEksporPDF={handleEksporPDF}
          jumlahTransaksi={transaksiDifilter.length}
        />

        {/* Riwayat Transaksi ala DompetKu */}
        <TransactionList
          transaksi={transaksiDifilter}
          onMintaHapus={(item) => setItemToDelete(item)}
          onMintaEdit={handleBukaEdit}
          onBukaTambah={handleBukaTambah}
          saldoBulanSebelumnya={saldoBulanSebelumnya}
          namaBulanSebelumnya={namaBulanSebelumnya}
          selectedMonth={selectedMonth}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Buku Kas &bull; Kelas 1 Makkah SDIT AL-HAMRA
        </p>
      </footer>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-5 right-5 sm:hidden z-40">
        <button
          type="button"
          onClick={handleBukaTambah}
          className={`w-12 h-12 rounded-2xl text-white shadow-xl flex items-center justify-center text-xl font-bold active:scale-95 transition cursor-pointer ${currentAccent.btn}`}
          title="Catat Transaksi"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Modal Input Transaksi */}
      {isModalOpen && (
        <TransactionForm
          isOpen={isModalOpen}
          onClose={handleCloseForm}
          onTambahTransaksi={handleTambahTransaksi}
          editingItem={editingItem}
          onUpdateTransaksi={handleUpdateTransaksi}
          onMintaHapus={(item) => setItemToDelete(item)}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleHapusTransaksi}
        transaksi={itemToDelete}
      />

      {/* Modal Preview PDF dengan Download & Cancel */}
      <PdfPreviewModal
        isOpen={!!pdfPreview}
        onClose={handleClosePdfPreview}
        onDownload={handleDownloadPdf}
        previewData={pdfPreview}
        currentAccent={currentAccent}
      />
    </div>
  );
}

export default App;
