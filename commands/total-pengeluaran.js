import { getPengeluaranByDateRange } from '../function/transaksi.js';

export async function handlePengeluaran(message, auth, sender, text) {
  const parts = text.trim().split(' ');

  if (parts.length < 2) {
    message.reply('⚠️ Format salah. Gunakan:\n/pengeluaran <tgl>\n/pengeluaran <tgl awal> <tgl akhir>');
    return;
  }

  let tglAwal = parts[1];
  let tglAkhir = parts[2] || parts[1];

  try {
    const objectPengeluaran = await getPengeluaranByDateRange(auth,sender,tglAwal, tglAkhir);
    const pengeluaranList = formatPengeluaranResponse(objectPengeluaran);
    
    message.reply(pengeluaranList);
  } catch (err) {
    console.error(err);
     message.reply(`❌ Gagal mengambil data pengeluaran.`);
  }
}

function formatPengeluaranResponse(pengeluaranList) {
  // Group by tanggal (tgl)
  const grouped = pengeluaranList.reduce((acc, item) => {
    const tanggal = item.tgl.split(',')[0]; // ambil tanggal tanpa jam: "06/06/2025"
    if (!acc[tanggal]) acc[tanggal] = [];
    acc[tanggal].push(item);
    return acc;
  }, {});

  let response = '';

  for (const tanggal of Object.keys(grouped)) {
    response += `${tanggal}\n`;
    for (const item of grouped[tanggal]) {
      // misal keterangan + nilai (nilai number / string)
      response += `${item.keterangan} ${item.nilai}\n`;
    }
  }

  return response.trim(); // hilangkan trailing newline
}
