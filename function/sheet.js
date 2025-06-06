// function/sheet.js
import { google } from 'googleapis';

const SPREADSHEET_ID = '1vSlsOHK9UP7-KQgHErBI5PjLwxArRvCLRskAmbnRd5A'; // Ganti dengan Spreadsheet ID kamu

// Buat tab baru jika belum ada
export async function ensureSheetExists(auth, sheetName) {
  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheetExists = res.data.sheets.some(
    (s) => s.properties.title === sheetName
  );

  if (!sheetExists) {
    // Buat sheet baru
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });

    // Tambahkan header
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:G1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          ['tgl', 'kategori', 'type', 'nilai', 'keterangan', 'saldo'],
        ],
      },
    });
  }
}

// Tambahkan baris baru ke sheet tertentu
export async function appendRow(message,auth, sheetName, row,msg) {
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:G`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [row],
    },
  });
message.reply(msg);

}

// Fungsi baca semua transaksi dari sheet (sheetName bisa dinamis sesuai chat id)
export async function readTransaksiSheet(auth, sheetName) {
  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:G`, // misal kolom A sampai G sesuai struktur kamu
  });

  const rows = response.data.values || [];
  if (rows.length === 0) {
    return [];
  }

  // Asumsikan baris pertama adalah header
  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Ubah array rows jadi array objek berdasarkan header
  return dataRows.map(row => {
    const obj = {};
    headers.forEach((header, idx) => {
      obj[header.toLowerCase()] = row[idx];
    });
    return obj;
  });
}
