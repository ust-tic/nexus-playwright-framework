// File: scripts/postReportEnhancer.ts
import { execSync } from 'child_process';
import { enhanceAllureVisuals } from '../src/utils/logger/enhanceAllureVisuals';
import * as fs from 'fs';
import * as path from 'path';

const reportDir = path.resolve(__dirname, '../allure-report');
const indexHtml = path.join(reportDir, 'index.html');
const stylesCss = path.join(reportDir, 'styles.css');

function waitUntilReportIsReady(timeout = 15000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (fs.existsSync(indexHtml) && fs.existsSync(stylesCss)) {
        clearInterval(interval);
        resolve();
      } else if ((Date.now() - start) > timeout) {
        clearInterval(interval);
        reject(new Error('❌ Timeout: Report files not found.'));
      }
    }, 300);
  });
}

(async () => {
  try {
    console.log('🔷 Step 1: Generating Allure report...');
    execSync('npx allure generate ./allure-results --clean -o ./allure-report', {
      stdio: 'inherit',
    });

    console.log('🔷 Step 2: Waiting for Allure report files...');
    await waitUntilReportIsReady();

    console.log('🔷 Step 3: Enhancing report (logo, styles, header, metadata)...');
    await enhanceAllureVisuals();

    console.log('\n✅ Allure report ready at: ./allure-report/index.html');
  } catch (err) {
    console.error('❌ Error in post-report enhancer:', err);
  }
})();
