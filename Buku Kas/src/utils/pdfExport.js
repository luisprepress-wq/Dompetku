import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatRupiah, formatTanggal, getNamaBulan } from './formatters';

/**
 * Generate and download PDF report
 * @param {Object} params
 * @param {Array} params.transaksi - Seluruh transaksi atau yang sudah difilter
 * @param {string|number} params.bulan - Bulan terpilih ('1'-'12' atau 'all')
 * @param {string|number} params.tahun - Tahun terpilih ('2026' dsb)
 * @param {number} params.totalPemasukan
 * @param {number} params.totalPengeluaran
 * @param {number} params.saldoAkhir
 */
export const eksporLaporanKasPDF = ({
  transaksi = [],
  semuaTransaksi = [],
  bulan = 'all',
  tahun = new Date().getFullYear(),
  saldoBulanSebelumnya: paramSaldoSebelum,
  totalPemasukan = 0,
  totalPengeluaran = 0,
  saldoAkhir = 0,
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;

  // Nama periode
  const namaBulanStr = bulan && bulan !== 'all' ? getNamaBulan(bulan) : 'Semua Bulan';
  const periodeText = `Periode: ${namaBulanStr} ${tahun}`;

  // Helper cek apakah transaksi merupakan saldo awal
  const isAwalKas = (t) =>
    t.isSaldoAwal ||
    (t.keterangan &&
      (t.keterangan.toLowerCase().includes('saldo awal') ||
        t.keterangan.toLowerCase().includes('sisa uang kas')));

  // Hitung Saldo Bulan Sebelumnya jika bulan tertentu dipilih
  const poolTransaksi = semuaTransaksi && semuaTransaksi.length > 0 ? semuaTransaksi : transaksi;
  let saldoBulanSebelumnya = 0;
  let namaBulanSebelumnya = '';

  if (bulan && bulan !== 'all') {
    const bulanInt = parseInt(bulan, 10);
    const tahunInt = parseInt(tahun, 10);
    let prevBulanInt = bulanInt - 1;
    let prevTahunInt = tahunInt;
    if (prevBulanInt < 1) {
      prevBulanInt = 12;
      prevTahunInt = tahunInt - 1;
    }
    namaBulanSebelumnya = `${getNamaBulan(prevBulanInt)} ${prevTahunInt}`;

    if (paramSaldoSebelum !== undefined) {
      saldoBulanSebelumnya = Number(paramSaldoSebelum) || 0;
    } else {
      const cutOffDate = new Date(tahunInt, bulanInt - 1, 1);
      poolTransaksi.forEach((t) => {
        if (!t.tanggal) return;
        const tDate = new Date(t.tanggal);
        if (tDate < cutOffDate) {
          const nom = Number(t.nominal) || 0;
          if (t.jenis === 'pemasukan') saldoBulanSebelumnya += nom;
          else if (t.jenis === 'pengeluaran') saldoBulanSebelumnya -= nom;
        }
      });
    }
  }

  // Pisahkan transaksi pemasukan dan pengeluaran bulan berjalan
  const dataPemasukan = transaksi
    .filter((t) => t.jenis === 'pemasukan')
    .sort((a, b) => {
      if (isAwalKas(a) && !isAwalKas(b)) return -1;
      if (!isAwalKas(a) && isAwalKas(b)) return 1;
      return new Date(a.tanggal) - new Date(b.tanggal);
    });

  // Tabel pengeluaran HANYA pengeluaran bulan berjalan (pengeluaran bulan sebelumnya tidak dimasukkan)
  const dataPengeluaran = transaksi
    .filter((t) => t.jenis === 'pengeluaran')
    .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  // ================= 1. KOP LAPORAN =================
  let startY = 16;

  // Nama Lembaga / Sekolah
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105); // Slate 600
  doc.text('SDIT AL-HAMRA', pageWidth / 2, startY, { align: 'center' });

  // Judul Utama
  startY += 7;
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text('LAPORAN KAS KELAS', pageWidth / 2, startY, { align: 'center' });

  // Sub Judul Kelas
  startY += 6;
  doc.setFontSize(13);
  doc.setTextColor(5, 150, 105); // Emerald 600
  doc.text('KELAS 1 MAKKAH', pageWidth / 2, startY, { align: 'center' });

  // Periode
  startY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text(periodeText, pageWidth / 2, startY, { align: 'center' });

  // Garis Pembatas Kop
  startY += 4;
  doc.setDrawColor(5, 150, 105); // Emerald line
  doc.setLineWidth(0.8);
  doc.line(marginX, startY, pageWidth - marginX, startY);

  doc.setDrawColor(203, 213, 225); // Slate line halus
  doc.setLineWidth(0.2);
  doc.line(marginX, startY + 1, pageWidth - marginX, startY + 1);

  startY += 8;

  // Tanggal cetak di kanan atas tabel
  const todayStr = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Waktu Cetak: ${todayStr}`, pageWidth - marginX, startY - 2, { align: 'right' });

  // ================= 2. TABEL PEMASUKAN =================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(4, 120, 87); // Emerald 700
  doc.text('A. DAFTAR PEMASUKAN', marginX, startY);

  startY += 3;

  let bodyPemasukan = [];
  let totalMasukFinal = 0;

  if (saldoBulanSebelumnya > 0 && bulan !== 'all') {
    const bulanInt = parseInt(bulan, 10);
    const tglAwalBulan = `01/${String(bulanInt).padStart(2, '0')}/${tahun}`;

    // Baris No. 1: Sisa saldo bulan sebelumnya DI-BLOCK WARNA ORANGE
    const rowSaldoSebelumnya = [
      {
        content: 1,
        styles: {
          fillColor: [254, 215, 170], // Orange / Amber-200 block
          textColor: [154, 52, 18],   // Amber-800 dark text
          fontStyle: 'bold',
          halign: 'center',
        },
      },
      {
        content: tglAwalBulan,
        styles: {
          fillColor: [254, 215, 170],
          textColor: [154, 52, 18],
          fontStyle: 'bold',
          halign: 'center',
        },
      },
      {
        content: `Sisa Saldo Kas Bulan Sebelumnya (${namaBulanSebelumnya})`,
        styles: {
          fillColor: [254, 215, 170],
          textColor: [154, 52, 18],
          fontStyle: 'bold',
        },
      },
      {
        content: formatRupiah(saldoBulanSebelumnya),
        styles: {
          fillColor: [254, 215, 170],
          textColor: [154, 52, 18],
          fontStyle: 'bold',
          halign: 'right',
        },
      },
      {
        content: 'Saldo Awal Kas',
        styles: {
          fillColor: [254, 215, 170],
          textColor: [154, 52, 18],
          fontStyle: 'bold',
        },
      },
    ];

    // Baris-baris pemasukan bulan berjalan di bawahnya
    const rowsPemasukanBulanIni = dataPemasukan.map((item, idx) => [
      idx + 2,
      formatTanggal(item.tanggal),
      item.keterangan || '-',
      formatRupiah(item.nominal),
      item.keteranganTambahan || '-',
    ]);

    bodyPemasukan = [rowSaldoSebelumnya, ...rowsPemasukanBulanIni];
    totalMasukFinal =
      saldoBulanSebelumnya +
      dataPemasukan.reduce((acc, t) => acc + (Number(t.nominal) || 0), 0);
  } else {
    if (dataPemasukan.length > 0) {
      bodyPemasukan = dataPemasukan.map((item, idx) => {
        const isFirstSaldoAwal = idx === 0 && isAwalKas(item);
        if (isFirstSaldoAwal) {
          return [
            {
              content: idx + 1,
              styles: {
                fillColor: [254, 215, 170], // Orange block
                textColor: [154, 52, 18],
                fontStyle: 'bold',
                halign: 'center',
              },
            },
            {
              content: formatTanggal(item.tanggal),
              styles: {
                fillColor: [254, 215, 170],
                textColor: [154, 52, 18],
                fontStyle: 'bold',
                halign: 'center',
              },
            },
            {
              content: item.keterangan || '-',
              styles: {
                fillColor: [254, 215, 170],
                textColor: [154, 52, 18],
                fontStyle: 'bold',
              },
            },
            {
              content: formatRupiah(item.nominal),
              styles: {
                fillColor: [254, 215, 170],
                textColor: [154, 52, 18],
                fontStyle: 'bold',
                halign: 'right',
              },
            },
            {
              content: item.keteranganTambahan || 'Saldo Awal Kas',
              styles: {
                fillColor: [254, 215, 170],
                textColor: [154, 52, 18],
                fontStyle: 'bold',
              },
            },
          ];
        }
        return [
          idx + 1,
          formatTanggal(item.tanggal),
          item.keterangan || '-',
          formatRupiah(item.nominal),
          item.keteranganTambahan || '-',
        ];
      });
      totalMasukFinal = dataPemasukan.reduce(
        (acc, t) => acc + (Number(t.nominal) || 0),
        0
      );
    } else {
      bodyPemasukan = [['-', '-', 'Tidak ada data pemasukan pada periode ini', 'Rp 0', '-']];
      totalMasukFinal = 0;
    }
  }

  autoTable(doc, {
    startY: startY,
    head: [['No', 'Tanggal', 'Keterangan Transaksi', 'Nominal', 'Keterangan Tambahan']],
    body: bodyPemasukan,
    foot: [
      [
        {
          content: 'Total Pemasukan',
          colSpan: 3,
          styles: { halign: 'right', fontStyle: 'bold' },
        },
        {
          content: formatRupiah(totalMasukFinal),
          styles: { halign: 'right', fontStyle: 'bold', textColor: [4, 120, 87] },
        },
        {
          content: '',
          styles: { halign: 'center' },
        },
      ],
    ],
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [5, 150, 105], // Emerald 600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    footStyles: {
      fillColor: [236, 253, 245], // Emerald 50
      textColor: [4, 120, 87],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 24 },
      2: { halign: 'left' },
      3: { halign: 'right', cellWidth: 35 },
      4: { halign: 'left', cellWidth: 45 },
    },
  });

  let currentY = doc.lastAutoTable.finalY + 8;

  // Cek apakah halaman cukup untuk tabel pengeluaran
  if (currentY > pageHeight - 65) {
    doc.addPage();
    currentY = 20;
  }

  // ================= 3. TABEL PENGELUARAN =================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(190, 18, 60); // Rose 700
  doc.text('B. DAFTAR PENGELUARAN', marginX, currentY);

  currentY += 3;

  const bodyPengeluaran =
    dataPengeluaran.length > 0
      ? dataPengeluaran.map((item, index) => [
          index + 1,
          formatTanggal(item.tanggal),
          item.keterangan || '-',
          formatRupiah(item.nominal),
          item.keteranganTambahan || '-',
        ])
      : [['-', '-', 'Tidak ada data pengeluaran pada periode ini', 'Rp 0', '-']];

  const totalKeluarFinal = dataPengeluaran.reduce(
    (acc, t) => acc + (Number(t.nominal) || 0),
    0
  );

  const saldoAkhirFinal = totalMasukFinal - totalKeluarFinal;

  autoTable(doc, {
    startY: currentY,
    head: [['No', 'Tanggal', 'Keterangan Transaksi', 'Nominal', 'Keterangan Tambahan']],
    body: bodyPengeluaran,
    foot: [
      [
        {
          content: 'Total Pengeluaran',
          colSpan: 3,
          styles: { halign: 'right', fontStyle: 'bold' },
        },
        {
          content: formatRupiah(totalKeluarFinal),
          styles: { halign: 'right', fontStyle: 'bold', textColor: [190, 18, 60] },
        },
        {
          content: '',
          styles: { halign: 'center' },
        },
      ],
    ],
    margin: { left: marginX, right: marginX },
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      textColor: [30, 41, 59],
    },
    headStyles: {
      fillColor: [225, 29, 72], // Rose 600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    footStyles: {
      fillColor: [255, 241, 242], // Rose 50
      textColor: [190, 18, 60],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 24 },
      2: { halign: 'left' },
      3: { halign: 'right', cellWidth: 35 },
      4: { halign: 'left', cellWidth: 45 },
    },
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // Cek apakah halaman cukup untuk footer & tanda tangan
  if (currentY > pageHeight - 55) {
    doc.addPage();
    currentY = 20;
  }

  // ================= 4. KOTAK KESIMPULAN / SALDO AKHIR =================
  const boxWidth = pageWidth - marginX * 2;
  const boxHeight = 22;

  // Background Box
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, boxWidth, boxHeight, 2, 2, 'FD');

  // Isi Ringkasan
  const colW = boxWidth / 3;

  // Kolom 1: Total Pemasukan
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL PEMASUKAN', marginX + 6, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(4, 120, 87);
  doc.text(formatRupiah(totalMasukFinal), marginX + 6, currentY + 14);

  // Garis vertikal 1
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX + colW, currentY + 3, marginX + colW, currentY + boxHeight - 3);

  // Kolom 2: Total Pengeluaran
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL PENGELUARAN', marginX + colW + 6, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(190, 18, 60);
  doc.text(formatRupiah(totalKeluarFinal), marginX + colW + 6, currentY + 14);

  // Garis vertikal 2
  doc.line(marginX + colW * 2, currentY + 3, marginX + colW * 2, currentY + boxHeight - 3);

  // Kolom 3: Saldo Akhir
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('SISA SALDO AKHIR', marginX + colW * 2 + 6, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  if (saldoAkhirFinal >= 0) {
    doc.setTextColor(15, 23, 42); // Slate 900
  } else {
    doc.setTextColor(220, 38, 38); // Red 600 (defisit)
  }
  doc.text(formatRupiah(saldoAkhirFinal), marginX + colW * 2 + 6, currentY + 14);

  currentY += boxHeight + 12;

  // Cek apakah halaman cukup untuk Tanda Tangan
  if (currentY > pageHeight - 35) {
    doc.addPage();
    currentY = 20;
  }

  // ================= 5. TANDA TANGAN / PENGESAHAN =================
  const ttdX = pageWidth - marginX - 55;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Mengetahui,', ttdX, currentY);
  doc.text('Wali Kelas / Bendahara', ttdX, currentY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('( ......................................... )', ttdX, currentY + 24);

  // ================= 6. NOMOR HALAMAN (FOOTER) =================
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(
      `Buku Kas Kelas 1 Makkah - SDIT AL-HAMRA  |  Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Nama file saat diunduh
  const sanitizeBulan = namaBulanStr.replace(/\s+/g, '_');
  const filename = `Laporan_Kas_Kelas_1_Makkah_${sanitizeBulan}_${tahun}.pdf`;

  // Buat Blob URL untuk Preview
  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);

  return {
    doc,
    filename,
    blobUrl,
    periodeText,
  };
};

export const generateLaporanKasPDF = eksporLaporanKasPDF;
