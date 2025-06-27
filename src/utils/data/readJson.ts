import fs from 'fs';
import path from 'path';

export function readJson(fileName: string): any {
  const filePath = path.resolve(__dirname, '../data', fileName);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}
