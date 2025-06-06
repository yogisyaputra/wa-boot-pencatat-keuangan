import fs from 'fs';
const SALDO_PATH = './storage/saldo.json';

export function getSaldo(nomor) {
  if (!fs.existsSync(SALDO_PATH)) return 0;
  const data = JSON.parse(fs.readFileSync(SALDO_PATH));
  return data[nomor] || 0;
}

export function updateSaldo(nomor, nilai, type) {
  let data = {};
  if (fs.existsSync(SALDO_PATH)) {
    data = JSON.parse(fs.readFileSync(SALDO_PATH));
  }
  const current = data[nomor] || 0;
  const updated = type === 'MASUK' ? current + nilai : current - nilai;
  data[nomor] = updated;
  fs.writeFileSync(SALDO_PATH, JSON.stringify(data, null, 2));
  return updated;
}
