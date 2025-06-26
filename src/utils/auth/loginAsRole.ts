import { existsSync, readFileSync } from "fs";
import { logger } from "../logger/winstonLogger";
import { createBrowserContextWithPage } from "../browser/browserFactory";
import { getBaseURL } from "../config/envHelper";
import { LoginPage } from "../../pages/login.page";

export async function loginAsRole(role: 'superuser' | 'cmo' | 'cosigner') {
  try {
    const storageFile = `../${role}.json`;
    if (existsSync(storageFile)) {
      logger.info(`✅ Session already exists for role: ${role}`);
      return;
    }

    const { browser, context, page } = await createBrowserContextWithPage();
    const appUrl = getBaseURL(); // from envHelper
    await page.goto(appUrl);

    const credentials = {
      superuser: {
        username: process.env.SUPERUSER_USERNAME!,
        password: process.env.SUPERUSER_PASSWORD!
      },
      cmo: {
        username: process.env.CMO_USERNAME!,
        password: process.env.CMO_PASSWORD!
      },
      cosigner: {
        username: process.env.COSIGNER_USERNAME!,
        password: process.env.COSIGNER_PASSWORD!
      }
    }
   const { username, password } = credentials[role];
  logger.info(`🔵 Starting global setup for login session...`);
  console.log(`🔐 Logging in as [${role}] with username: ${username}`);

  const loginPage = new LoginPage(page);
  await loginPage.loginToApplication();
  await page.waitForSelector('#popover-trigger-4');

  await context.storageState({ path: storageFile });
  logger.info(`${role} is saved`);

  await browser.close();
  logger.info(`✅ Global setup completed and browser closed.`);
}
catch (error) {
  logger.error(`❌ Global setup failed: ${error}`);
  process.exit(1);
}

}