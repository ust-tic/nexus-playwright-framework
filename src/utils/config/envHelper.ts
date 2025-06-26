import * as dotenv from 'dotenv';
import * as path from 'path';

if (process.env.CI !== 'true') {
  // Load secrets locally
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

  // Load config environment
  const envName = process.env.ENV || 'qa';
  dotenv.config({ path: path.resolve(process.cwd(), `config/.env.${envName}`) });
}

export function getBaseURL(): string {
  const country = (process.env.COUNTRY || 'JAPAN').toUpperCase();
  const key = `APP_URL_${country}`;
  const baseURL = process.env[key];

  if (!baseURL) {
    throw new Error(`❌ No APP_URL found for COUNTRY: ${country}`);
  }

  return baseURL;
}
