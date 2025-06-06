import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import {promises as fsPromises} from 'fs';
import {google} from 'googleapis';
import {addKategori, getKategoriByUser} from "./commands/kategori.js";
import {handleMasuk} from './commands/masuk.js';
import {handleKeluar} from './commands/keluar.js';
import {loadCommands} from './function/commands.js';
import {getSaldo,updateSaldo} from './function/saldo.js';
import { handlePengeluaran } from './commands/total-pengeluaran.js';

const {readFile} = fsPromises;
const {Client, LocalAuth} = pkg;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = '1vSlsOHK9UP7-KQgHErBI5PjLwxArRvCLRskAmbnRd5A';  // ganti dengan ID spreadsheet Anda
const SHEET_NAME = 'Sheet1';  // nama sheet yang dipakai

async function authorize() {
    const content = await readFile('credentials.json', 'utf8');
    const credentials = JSON.parse(content);
    const {client_email} = credentials;
    const privateKey = credentials.private_key.replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
        email: credentials.client_email,
        key: privateKey,
        scopes: SCOPES,
    });
    await auth.authorize();
    return auth;
}


// Fungsi untuk tambah baris baru ke Google Sheets
async function appendRow(auth, row) {
    const sheets = google.sheets({version: 'v4', auth});

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: SHEET_NAME,
        valueInputOption: 'RAW',
        resource: {
            values: [row],
        },
    });
}

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    authStrategy: new LocalAuth(),
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
    console.log('Scan this QR code with your WhatsApp app:');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async message => {
    try {
        // Contoh format input:
        // "- 10000 makan siang"
        // "+ 50000 gaji"
        const text = message.body.trim();
        const parts = text.split(' ');
        const sender = message.from.replace("@c.us", "");

        if (!text.startsWith('/')) {
            return;
        } else if (text.startsWith('/') && text.length === 1) {
            const commandList = await loadCommands();
            const teks = `📜 *Daftar Perintah Tersedia:*\n\n` + commandList.map(c => `• ${c}`).join('\n');
            message.reply(teks);
        }else if (text.startsWith('/total-pengeluaran')) {
                        const auth = await authorize();
            await handlePengeluaran(message, auth, sender, text);
        }
         else if(text.startsWith('/saldo')) {
            const saldo = await getSaldo(sender);
            const teks = `💰 *Saldo Anda: ${saldo}*` ;
            message.reply(teks);
        }
        else if (text.startsWith('/masuk')) {
            // Authorize Google API
            const auth = await authorize();
            if (parts[1] === 'format' || parts[1] === 'contoh') {
                message.reply('/masuk <nilai> <keterangan>');
                return
            }
            handleMasuk(message, auth, sender, text);
        } else if (text.startsWith('/keluar')) {
            // Authorize Google API
            const auth = await authorize();
            if (parts[1] === 'format' || parts[1] === 'contoh') {
                message.reply('/keluar <kategori> <nilai> <keterangan>');
                return
            }
            handleKeluar(message, auth, sender, text);
        } else if (message.body.startsWith("/kategori")) {
            if (parts.length === 1) {
                const kategori = getKategoriByUser(sender);
                const response = kategori.length
                    ? `✅ Daftar Kategori:\n${kategori.map((k, i) => `${i + 1}. ${k}`).join("\n")}`
                    : "📭 Belum ada kategori.";
                message.reply(response);
            } else {
                const kategoriBaru = parts.slice(1).join(" ");
                const success = addKategori(sender, kategoriBaru);
                const response = success
                    ? `✅ Kategori '${kategoriBaru}' berhasil ditambahkan.`
                    : `⚠️ Kategori '${kategoriBaru}' sudah ada.`;
                message.reply(response);
            }
        } else {
            const commandList = await loadCommands();
            const teks = `📜 *Daftar Perintah Tersedia:*\n\n` + commandList.map(c => `• ${c}`).join('\n');
            message.reply(teks);
            return;
        }
    } catch (error) {
        console.error(error);
        message.reply('Terjadi error saat menyimpan catatan.');
    }
});

client.initialize();
