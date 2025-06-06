import {appendRow, ensureSheetExists} from '../function/sheet.js';
import {updateSaldo} from '../function/saldo.js';

export async function handleMasuk(message, auth, nomor, pesan) {

    // Contoh isi pesan: "/masuk 10000 beli pulsa"
    const parts = pesan.split(' ');
    if (parts.length < 3) {
        message.reply('Format salah. Contoh: /masuk 10000 gaji');
        return;
    }
    const nilai = parseInt(parts[1]);

    if (isNaN(nilai)) {
        message.reply(`Format salah, gunakan format: \n /masuk <nilai> <keterangan>`);
        return;
    }
    const keterangan = parts.slice(2).join(' ');

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

    const saldoBaru = await updateSaldo(nomor, nilai, 'MASUK');

    // Siapkan sheetName dari nomor WA
    const sheetName = nomor;

    await ensureSheetExists(auth, sheetName);

    const row = [
        tanggal,
        '',
        'MASUK',
        nilai,
        keterangan,
        saldoBaru,
    ];

      const msg = `Catatan berhasil disimpan:\n Pemasukan sebesar ${nilai} dari ${keterangan}. \n Saldo akhir sekarang: ${saldoBaru}`;

    await appendRow(message, auth, sheetName, row,msg);

    return `✅ Pemasukan sebesar ${nilai} telah dicatat di sheet ${sheetName}.\nSaldo sekarang: ${saldoBaru}`;
}
