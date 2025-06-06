import { ensureSheetExists, appendRow } from '../function/sheet.js';
import { updateSaldo, getSaldo } from '../function/saldo.js';

export async function handleKeluar(message,auth, nomor, pesan) {

  // Contoh isi pesan: "/keluar 10000 beli pulsa"
  const parts = pesan.split(' ');
if (parts.length < 4) {
    message.reply('Format salah. Contoh: /keluar <kategori> <nilai> <keterangan>');
                return;
}
  const nilai = parseInt(parts[2]);

      if (isNaN(nilai)) {
        message.reply(`Format salah, gunakan format: \n /keluar <kategori> <nilai> <keterangan>`);
        return;
    }

  const keterangan =  parts.slice(3).join(' ');

  // Ambil tanggal sekarang
            const now = new Date();
            const tanggal = now.toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

  const saldoBaru = await updateSaldo(nomor, nilai, 'KELUAR');

  // Siapkan sheetName dari nomor WA
  const sheetName = nomor;

  await ensureSheetExists(auth, sheetName);

  const row = [
    tanggal,
    parts[1],
    'KELUAR',
    nilai,
    keterangan,
    saldoBaru,
  ];

  const msg = `Catatan berhasil disimpan:\n Pengeluaran ${parts[1]} sebesar ${nilai} untuk ${keterangan}. \n Saldo akhir sekarang: ${saldoBaru}`;

  await appendRow(message,auth, sheetName, row,msg);

  return `✅ Pemasukan sebesar ${nilai} telah dicatat di sheet ${sheetName}.\nSaldo sekarang: ${saldoBaru}`;
}
