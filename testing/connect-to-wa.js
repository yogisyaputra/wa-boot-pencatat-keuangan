import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;

const client = new Client({
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  authStrategy: new LocalAuth(),
});

client.on('qr', qr => {
  // Tampilkan QR code di terminal supaya bisa discan lewat WhatsApp
  qrcode.generate(qr, { small: true });
  console.log('Scan this QR code with your WhatsApp app:');
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', message => {
  console.log(`Received message: ${message.body}`);

  // Contoh reply simple
  if (message.body.toLowerCase() === 'ping') {
    message.reply('pong');
  }
});

client.initialize();
