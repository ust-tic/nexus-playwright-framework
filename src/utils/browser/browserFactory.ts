import { chromium, firefox, webkit, Browser } from 'playwright';
import { logger } from '../logger/winstonLogger';

const browserName = process.env.BROWSER?.toLowerCase() || 'chromium';
const isHeadless = process.env.HEADLESS?.toLowerCase() !== 'false'; // default = true

export async function launchBrowser(): Promise<Browser> {
  logger.info(`🧭 Launching browser: ${browserName} | headless: ${isHeadless}`);

  switch (browserName) {
    case 'chrome':
    case 'chrome-stable':
      logger.info('🟡 Launching Chrome (stable)...');
      return await chromium.launch({
        channel: 'chrome',
        headless: isHeadless,
      });

    case 'edge':
      logger.info('🟣 Launching Edge...');
      return await chromium.launch({
        channel: 'msedge',
        headless: isHeadless,
      });

    case 'chromium':
      logger.info('🧪 Launching Chromium...');
      return await chromium.launch({ headless: isHeadless });

    case 'firefox':
      logger.info('🦊 Launching Firefox...');
      return await firefox.launch({ headless: isHeadless });

    case 'webkit':
      logger.info('🍎 Launching Webkit...');
      return await webkit.launch({ headless: isHeadless });

    default:
      throw new Error(`❌ Unsupported browser type: ${browserName}`);
  }
}

export async function createBrowserContextWithPage() {
  const browser = await launchBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();
  return { browser, context, page };
}
