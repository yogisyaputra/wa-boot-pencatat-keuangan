import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, "/storage/kategori.json");

function loadKategori() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(filePath));
}

function saveKategori(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getKategoriByUser(user) {
  const data = loadKategori();
  return data[user] || [];
}

function addKategori(user, kategoriBaru) {
  const data = loadKategori();
  const kategori = (data[user] = data[user] || []);
  if (!kategori.includes(kategoriBaru.toLowerCase())) {
    kategori.push(kategoriBaru.toLowerCase());
    saveKategori(data);
    return true;
  } else {
    return false;
  }
}

export { getKategoriByUser, addKategori };
