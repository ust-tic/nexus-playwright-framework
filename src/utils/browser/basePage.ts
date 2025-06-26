import { Page, Locator } from "@playwright/test";
import { logger } from "../logger/winstonLogger";
import { readJson } from "../data/readJson";

export default class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Clicks on an element after ensuring it’s visible.
     * Logs the action or errors if the element isn’t interactable.
     * @param object - Locator of the element to click.
     */
    async click(object: any): Promise<void> {
        try {
            await this.getLocator(object).waitFor({
                state: "visible",
                timeout: 3000,
            });
            await this.getLocator(object).click();
            logger.info(`Clicked on ${object["description"]}`);
        } catch (error) {
            logger.error(`Error clicking on ${object["description"]}`, error);
        }
    }

    /**
     * Enters text into an input field after ensuring it’s visible.
     * Logs the action or errors if the element isn’t interactable.
     * @param object - Locator of the input field.
     * @param data - Text to enter.
     */
    async enter(object: any, data: string): Promise<void> {
        try {
            await this.getLocator(object).waitFor({
                state: "visible",
                timeout: 3000,
            });
            await this.getLocator(object).fill(data);
            logger.info(`Entered value ${data} on ${object["ActionOnThis"]}`);
        } catch (error) {
            logger.error(`Error entering value ${data} on ${object["description"]}`, error);
        }
    }

    /**
    * Retrieves a locator dynamically.
    * Logs the locator details or errors if the locator is not found.
    * @param object - The selector string for the element.
    * @param context - Optional context for scoped locators (e.g., within a parent).
    * @returns The Playwright Locator object.
    */
    getLocator(object: any, context?: any): Locator {
        try {
            const locator = context
                ? context.locator(object["locator"], object["locatorOptions"])
                : this.page.locator(object["locator"], object["locatorOptions"]);

            logger.info(`Retrieved locator for ${object["description"]}`);
            return locator;
        } catch (error) {
            logger.error(`Error retrieving locator for ${object["description"]}`, error);
            throw error;
        }
    }

    /**
     * Checks a checkbox after ensuring it’s visible and not already checked.
     * Logs the action or errors if the checkbox isn’t interactable.
     * @param object - Locator of the checkbox element.
     */
    async checkCheckbox(object: any): Promise<void> {
        try {
            await this.getLocator(object).waitFor({
                state: "visible",
                timeout: 3000,
            });

            const isChecked = await this.getLocator(object).isChecked();
            if (!isChecked) {
                await this.getLocator(object).check();
                logger.info(`Checked the checkbox: ${object["description"]}`);
            } else {
                logger.warn(`Checkbox is already checked: ${object["description"]}`);
            }
        } catch (error) {
            logger.error(`Error checking the checkbox: ${object["description"]}`, error);
        }
    }

    /**
     * Selects a value from a dropdown within an optional context.
     * Logs the action or errors if the dropdown isn't interactable.
     * @param object - Locator of the dropdown element.
     * @param value - Value to select.
     * @param context - Optional context (e.g. parent element or frame locator).
     */
    /**
    
     */
    async selectDropdown(object: any, optionText: string, context?: any): Promise<void> {
        try {
            const dropdownLocator = context
                ? context.locator(object["locator"], object["locatorOptions"])
                : this.page.locator(object["locator"], object["locatorOptions"]);

            // Ensure dropdown is visible
            await dropdownLocator.waitFor({ state: "visible", timeout: 3000 });

            // Select the option
            await dropdownLocator.selectOption({ label: optionText });

            logger.info(`Selected value '${optionText}' from dropdown: ${object["description"]}`);
        } catch (error) {
            logger.error(`Failed to select value '${optionText}' from dropdown: ${object["description"]}`, error);
        }
    }

    /**
     * Gets the text content of an element.
     * Logs the action or errors if the element isn’t interactable.
     * @param object - Locator of the element.
     * @returns The text content of the element.
     */
    async getText(object: any): Promise<string> {
        try {
            const element = this.page.locator(object["locator"]);
            const text = await element.textContent();
            logger.info(`Fetched text from element: ${text}`);
            return text ?? "";
        } catch (error) {
            logger.error(`Failed to retrieve text from element with locator: ${object["locator"]}`, error);
            return "";
        }
    }

    /**
     * Gets the text content of an element after ensuring it's visible.
     * Logs the action or errors if the element isn’t interactable.
     * @param object - Locator of the element.
     * @returns The text content of the element.
     */
    async getElementText(object: any): Promise<string> {
        try {
            await this.getLocator(object).waitFor({
                state: "visible",
                timeout: 3000,
            });
            return await this.getLocator(object).textContent() ?? "";
        } catch (error) {
            logger.error(`Error getting element text for ${object["description"]}`, error);
            return "";
        }
    }
    /**
   * Waits for an element to be visible.
   * Logs the action or errors if the element doesn't become visible.
   * @param object - Locator of the element.
   */
    async waitForVisibility(object: any): Promise<void> {
        try {
            await this.getLocator(object).waitFor({
                state: "visible",
                timeout: 6000,
            });
            logger.info(`Element is visible: ${object["description"]}`);
        } catch (error) {
            logger.error(`Element is not visible: ${object["description"]}`, error);
        }
    }

    /**
     * Waits for a specific timeout.
     * Logs the action.
     * @param timeout - Time in milliseconds to wait.
     */
    async waitForTimeout(timeout: number): Promise<void> {
        logger.info(`Waiting for ${timeout}ms`);
        await this.page.waitForTimeout(timeout);
    }

    /**
     * Gets the test case ID for a specific test from corresponding spec file.
     * @param testName - The name of the test (from testInfo).
     * @returns The test case ID or null if not found.
     */
    async getTestCaseID(testName: string): Promise<string | null> {
        try {
            const insuranceMap = readJson["insuranceManagementJson"];
            const testCaseID = insuranceMap[testName]?.testCaseID || null;
            return testCaseID;
        } catch (error) {
            logger.error(`Error reading testCaseID for ${testName}`, error);
            return null;
        }
    }

    /**
     * Performs a double-click on the element with optional action settings.
     * @param object - Locator object.
     */
    async doubleClick(object: any): Promise<void> {
        await this.getLocator(object).dblclick(object["actionOptions"]);
    }

    /**
     * Performs a standard action click on the element.
     * Uses wait and click timing strategy.
     * @param object - Locator object.
     */
    /**
     * Clicks an element from a dropdown (like Select2).
     * Supports multi-step wait and click flow.
     * @param option - The dropdown option locator.
     */
    async selectFromDropdownOption(option: any): Promise<void> {
        try {
            await this.getLocator(option).waitFor({ state: "visible", timeout: 10000 });
            await this.page.waitForTimeout(1000);
            await this.getLocator(option).click({ timeout: 10000 });
        } catch (error) {
            logger.error(`Error selecting dropdown option: ${option["description"]}`, error);
        }
    }

}
