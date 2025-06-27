import { Page, page } from '@playwright/test';
import { Browser } from 'playwright';
import { launchBrowser } from '../utils/browser/browserFactory';
import { logger } from '../utils/logger/winstonLogger';
import { testData } from '../testdata/';
import fs from 'fs';
import path from 'path';

const allure = new AllureLogger();

interface ScreenshotError extends Error {
  screenshotBuffer?: Buffer;
  page?: any;
  testName?: string | null;
}

logger.info('Starting to load hooks.ts');
let browser: Browser | null = null;
let page: Page;

test.beforeAll(async function () {
  logger.info('🔄 Launching browser before all tests...');
  try {
    logger.info(`🔁 info OS: ${process.platform}, Browser: ${process.env.BROWSER}, headless: ${envConfig.headless}`);
    browser = await launchBrowser()
    logger.info('✅ Browser successfully launched.');
  } catch (err) {
    logger.error('❌ Error while launching the browser:', err);
  }
});

test.beforeEach(async ({ page }, testInfo) => {
  logger.info(`🧪 Starting test: ${testInfo.title}`);
  try {
    if (!browser) {
      throw new Error('Browser is not initialized.');
    }

    const context = await browser.newContext({
      viewport: testData.viewport,
    });
    const page = await context.newPage();

    // Optional: Navigate to URL or perform setup
    await page.goto(envConfig.baseUrl);
  } catch (err) {
    logger.error(`❌ Failed to set up test: ${testInfo.title}`, err);
    throw err;
  }
});

test.afterEach(async ({ page }, testInfo) => {
  // logger.info(`🧪 Finished test: ${testInfo.title} -> ${testInfo.status}`);
  try {
    if (testInfo.status !== testInfo.expectedStatus) {
      // ❌ Test failed - log to winston and Allure
      logger.error(`❌ Test failed: ${testInfo.title} -> ${testInfo.status}`);

      // 1. attach full-page screenshot to Allure
      await allure.attach(
        `Failure Screenshot - ${testInfo.title}`,
        await page.screenshot(),
        { contentType: 'image/png' }
      );

      // 2. attach error message to Allure
      const errorMessage = testInfo.error?.message || 'No error message';
      await allure.attach('Error Message', errorMessage);

      // 3. attach winston logs (optional)
      const logPath = path.resolve(__dirname, '../../logs/automation.log');
      const logBuffer = fs.readFileSync(logPath, 'utf-8');
      await allure.attach('Automation Logs', logBuffer);
    } else {
      // ✅ Passed - log only to winston
      logger.info(`✅ Test Passed: ${testInfo.title}`);
    }
  } catch (err) {
    logger.error(`🔥 Error during after test: ${testInfo.title}`);
    logger.error(`Error during cleanup: ${(err as Error).message}`);
  }
});

test.afterAll(async () => {
  try {
    if (browser) {
      logger.info('🔻 Closing browser after all tests...');
      await browser.close();
    }
  } catch (err) {
    logger.error('🔥 Error while closing the browser.');
  }
});

export function getPage(): Page {
  return page;
}