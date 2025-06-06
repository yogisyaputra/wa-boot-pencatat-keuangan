import { parseSheetDate } from './utils.js';
import { readTransaksiSheet } from './sheet.js';

/**
 * Ambil transaksi pengeluaran (type 'keluar') dari sheet berdasar range tanggal
 * @param {object} auth Google auth object
 * @param {Date} startDate tanggal mulai (inclusive)
 * @param {Date} endDate tanggal akhir (inclusive)
 * @param {string} sheetName nama sheet (misal chat id)
 * @returns {Promise<Array>} array transaksi yang sudah difilter
 */
export async function getPengeluaranByDateRange(auth, startDate, endDate, sheetName) {
  const allTransaksi = await readTransaksiSheet(auth, sheetName);

  // Filter yang type 'keluar' dan tanggal di antara startDate s/d endDate
  return allTransaksi.filter((t) => {
    if (!t.type || t.type.toLowerCase() !== 'keluar') return false;

    const tglDate = parseSheetDate(t.tgl);
    if (!tglDate) return false;

    return tglDate >= startDate && tglDate <= endDate;
  });
}
