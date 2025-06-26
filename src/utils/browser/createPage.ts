import { Browser, Page } from '@playwright/test';
import { logger } from '../logger/winstonLogger';

export const createPage = async (browser: Browser): Promise<Page> => {
  const context = await browser.newContext();
  const page = await context.newPage();
  logger.info('📄 New page created...');
  return page;
};
