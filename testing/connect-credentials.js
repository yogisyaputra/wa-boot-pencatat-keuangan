import { google } from 'googleapis';
import fs from 'fs/promises';

const SCOPES = ['https://www.googleapis.com/auth/cloud-platform']; // atau scope bebas untuk test

async function testJWT() {
  const content = await fs.readFile('credentials.json', 'utf8');
  const credentials = JSON.parse(content);

  const privateKey = credentials.private_key.replace(/\\n/g, '\n');

  const jwtClient = new google.auth.JWT({
    email: credentials.client_email,
    key: privateKey,
    scopes: SCOPES,
  });

  const tokens = await jwtClient.authorize(); // hasil token di sini
  console.log('Access Token:', tokens.access_token);
  console.log('Expiry:', tokens.expiry_date);
}

testJWT().catch(console.error);
