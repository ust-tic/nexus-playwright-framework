import { Page } from '@playwright/test';
import loginLoc from '../locators/loginLocators.json';
import { getBaseURL } from '../utils/config/envHelper';
import BasePage from '../utils/browser/basePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async loginToApplication() {
    const appUrl = getBaseURL(); // from envHelper
    await this.page.goto(appUrl);
    await this.enter(loginLoc.username, process.env.SUPERUSER_USERNAME!);
    await this.enter(loginLoc.passwordField, process.env.SUPERUSER_PASSWORD!);
    await this.click(loginLoc.loginButton);
    await this.page.waitForLoadState("networkidle");
  }

  async logout() {
    await this.click(loginLoc.logoutButton);
  }
}
