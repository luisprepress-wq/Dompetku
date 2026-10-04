# Buku Kas Kelas - Kelas 1 Makkah (SDIT AL-HAMRA)

Aplikasi web modern untuk pencatatan keuangan kas kelas yang cepat, responsif, dan mudah digunakan.

## 🚀 Fitur Unggulan

1. **Identitas Khusus**: Dirancang untuk **Kelas 1 Makkah - SDIT AL-HAMRA**.
2. **Tanpa Login & Database Eksternal**: Menggunakan `localStorage` browser sehingga data tersimpan otomatis di perangkat Anda secara aman dan privat.
3. **Ringkasan Finansial**: 3 kartu ringkasan di bagian atas (**Total Pemasukan**, **Total Pengeluaran**, dan **Saldo Akhir**).
4. **Form Input Interaktif**:
   - Pilihan Tanggal (Date picker)
   - Input Keterangan
   - Toggle Pemasukan / Pengeluaran
   - Input Nominal dengan pemformatan otomatis Rupiah (`Rp`) & tombol cepat nominal.
5. **Riwayat Transaksi & Hapus**:
   - Daftar transaksi yang rapi dan terurut dari yang terbaru.
   - Tombol hapus dengan konfirmasi dialog untuk mencegah penghapusan tidak sengaja.
6. **Filter Periode**: Filter fleksibel berdasarkan Bulan (Januari - Desember atau Semua) dan Tahun.
7. **Ekspor PDF Bulan Ini (Resmi)**:
   - Dibuat menggunakan `jspdf` dan `jspdf-autotable`.
   - Kop Laporan resmi: Judul Laporan Kas Kelas, Kelas 1 Makkah, SDIT AL-HAMRA, Periode, & Tanggal Cetak.
   - **Tabel Khusus Pemasukan** dengan baris Total Pemasukan.
   - **Tabel Khusus Pengeluaran** dengan baris Total Pengeluaran.
   - Kotak **Saldo Akhir Periode** dan kolom **Tanda Tangan Pengesahan Bendahara/Wali Kelas**.

---

## 🛠️ Cara Menjalankan Aplikasi

Pastikan di komputer Anda sudah terinstal **Node.js** (versi 18 ke atas) dari [https://nodejs.org](https://nodejs.org).

Buka terminal (Command Prompt atau PowerShell) di folder proyek ini (`f:\Project\Project\Buku Kas`), lalu jalankan:

```bash
# 1. Install seluruh dependensi
npm install

# 2. Jalankan server lokal Vite
npm run dev
```

Aplikasi akan otomatis terbuka di browser pada alamat:
`http://localhost:3000` atau `http://localhost:5173`.
