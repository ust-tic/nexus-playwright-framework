import { loginAsRole } from '../src/utils/helpers/loginAsRole';
import path from 'path';
import fs from 'fs';
import { addCustomMetadata } from '../src/utils/logger/allureMetadata';
import dotenv from 'dotenv';

module.exports = async () => {
  dotenv.config({
    path: path.resolve(__dirname, `../config/env/.${process.env.ENV || 'qa'}`)
  });

  // Clean allure-results folder before test run
  const resultsDir = path.resolve(__dirname, '../allure-results');
  if (fs.existsSync(resultsDir)) {
    fs.rmSync(resultsDir, { recursive: true, force: true });
    console.log('✔ Cleaned ./allure-results');
  }

  // Write runtime metadata (start time)
  const startTime = new Date().toISOString();
  const runtimePath = path.join(resultsDir, 'runtime.json');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  fs.writeFileSync(runtimePath, JSON.stringify({ startTime: new Date().toISOString() }, null, 2));
  console.log(`🕐 Runtime started at: ${startTime.toLocaleTimeString()}`);

  // Add Allure metadata
  const suiteName = process.env.SUITE || 'smoke_suite';
  const country = process.env.COUNTRY || 'Japan';
  const displayName = `${suiteName}-${country}`;
  addCustomMetadata(displayName, country);

  // Login as superuser before test run
  // await loginAsRole('smc');
  await loginAsRole('superuser');
};
