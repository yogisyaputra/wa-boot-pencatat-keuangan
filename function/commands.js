import fs from 'fs/promises';
import path from 'path';

export async function loadCommands() {
  const filePath = path.resolve('./storage/commands.json');
  const data = await fs.readFile(filePath, 'utf-8');
  const json = JSON.parse(data);
  return json.commands;
}
