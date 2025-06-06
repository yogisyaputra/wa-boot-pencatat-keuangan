import { google } from 'googleapis';
import fs from 'fs/promises';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']; // Ganti sesuai kebutuhan

export async function authorize() {
  const content = await fs.readFile('credentials.json', 'utf8');
  const credentials = JSON.parse(content);

  const privateKey = credentials.private_key.replace(/\\n/g, '\n');

  const jwtClient = new google.auth.JWT({
    email: credentials.client_email,
    key: privateKey,
    scopes: SCOPES,
  });

  await jwtClient.authorize();
  return jwtClient;
}
