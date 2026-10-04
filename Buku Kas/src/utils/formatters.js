/**
 * Format angka menjadi format Rupiah Indonesia (contoh: Rp 50.000)
 * @param {number} value
 * @returns {string}
 */
export const formatRupiah = (value) => {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

/**
 * Format angka murni tanpa simbol Rp (contoh: 50.000)
 * @param {number|string} value
 * @returns {string}
 */
export const formatAngkaRibuan = (value) => {
  const cleanNumber = String(value).replace(/[^0-9]/g, '');
  if (!cleanNumber) return '';
  return new Intl.NumberFormat('id-ID').format(Number(cleanNumber));
};

/**
 * Membersihkan format string menjadi integer murni
 * @param {string|number} value
 * @returns {number}
 */
export const parseNominal = (value) => {
  if (typeof value === 'number') return value;
  const cleaned = String(value).replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
};

export const DAFTAR_BULAN = [
  { value: '1', label: 'Januari' },
  { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

/**
 * Mengubah index bulan (1-12) menjadi nama bulan Bahasa Indonesia
 * @param {number|string} month
 * @returns {string}
 */
export const getNamaBulan = (month) => {
  const found = DAFTAR_BULAN.find((b) => b.value === String(month));
  return found ? found.label : '';
};

/**
 * Format tanggal YYYY-MM-DD ke format Indonesia singkat (contoh: 02 Okt 2026)
 * @param {string} dateStr
 * @returns {string}
 */
export const formatTanggal = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10);
      const day = parts[2];
      const monthName = getNamaBulan(monthIndex).substring(0, 3);
      return `${day} ${monthName} ${year}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (err) {
    return dateStr;
  }
};

/**
 * Format tanggal YYYY-MM-DD ke format lengkap (contoh: 02 Oktober 2026)
 * @param {string} dateStr
 * @returns {string}
 */
export const formatTanggalLengkap = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10);
      const day = parts[2];
      return `${day} ${getNamaBulan(monthIndex)} ${year}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (err) {
    return dateStr;
  }
};
