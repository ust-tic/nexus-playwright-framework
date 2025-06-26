import { Locator, Page, expect } from "@playwright/test";
import BasePage from "../utils/browser/basePage";
import searchLoc from "../locators/standaloneSearchLocators.json";
import { getFakerData } from "../utils/data/fakerUtils";
import { logger } from "../utils/logger/winstonLogger";

declare global {
  var user: {
    firstName: string;
    lastName: string;
  };
}

export class StandaloneSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Once logged in, this method will navigate to the standalone search page.
   * After clicking on the search icon, waits for the page to load and display title correctly.
   */
  async navigateToStandaloneSearchPage() {
    await this.click(searchLoc.searchIcon);
    await this.waitForVisibility(searchLoc.standaloneTitle);
    expect(
      await this.getElementText(searchLoc.standaloneTitle)
    ).toBeTruthy();
  }

  /**
 * Searches for an insured person using random first and last name.
 * @param insuredType - The type of insured (NewInsured / ExistingInsured).
 * @param insuredName - Name of the insured from global first and last name generated using faker.
 */
async searchInsured(insuredType: string, insuredName: any) {
  if (insuredType === "NewInsured") {
    await this.enter(searchLoc.insuredSearchLastName, insuredName.lastName);
    await this.enter(searchLoc.insuredSearchFirstName, insuredName.firstName);
    await this.click(searchLoc.searchButton);
    const noSearchResults = "No matching results found";
    const actualMatchMessage = await this.getElementText(searchLoc.searchMessageForNoResults);
    searchLoc.searchMessageForNoResults
  );
  expect.soft(actualMatchMessage,noSearchResults).toBeTruthy()
  }else{
    await this.click(searchLoc.searchButton)
  }
}
/**
 * After searching for an existing insured, clicks on the insured whose alias is to be created.
 * Then clicks on the "Create New Alias" button.
 * This will open a modal for creating a new alias for the existing insured.
 */
async clickNewAlias() {
  await this.click(searchLoc.clickInsuredID);
  await this.click(searchLoc.createNewAlias);
}

/**
 * Fills out the insured form for insured/alias and whether optional fields should be included.
 * @param includeOptional - Whether to include optional fields.
 * @param insuredType - The type of insured (New / Existing).
 */
async fillInsuredForm(includeOptional: boolean, insuredType: string) {
  if (insuredType === "New") {
    const actualLastValue = await this.getLocator(
      searchLoc.familyName
    ).inputValue();

    const actualFirstValue = await this.getLocator(
      searchLoc.givenName
    ).inputValue();

    logger.info(
      `Last Name = ${user.lastName}, First Name = ${user.firstName}`
    );
     expect.soft(actualLastValue).toEqual(user.lastName);
    expect.soft(actualFirstValue).toEqual(user.firstName);
    await this.enter(searchLoc.dateOfBirth, getFakerData("dob"));
await this.getLocator(searchLoc.genderDropdown).click();

// get gender
const gendervalue = getFakerData("gender");
const capitalizedGender =
  gendervalue.charAt(0).toUpperCase() + gendervalue.slice(1);
await this.page.getByText(capitalizedGender, { exact: true }).click();
  
// else
const aliaslastname = getFakerData("lastName", "en");
const aliasfirstname = getFakerData("firstName", "en");

logger.info(
  `Alias Last Name = ${aliaslastname}, Alias First Name = ${aliasfirstname}`
);

await this.enter(searchLoc.familyName, aliaslastname);
await this.enter(searchLoc.givenName, aliasfirstname);
const completename = `${aliasfirstname} ${aliaslastname}`;
await this.getLocator(searchLoc.completeName).clear();
await this.enter(searchLoc.completeName, completename);

if (includeOptional) {
  await this.enter(searchLoc.middleName, getFakerData("middleName"));
  await this.enter(searchLoc.insuredIdCedant, getFakerData("insuredid"));
  await this.enter(searchLoc.insuredIdRga, getFakerData("insuredid"));
  await this.enter(
    searchLoc.alternateName,
    getFakerData("alternateName")
  );

  await this.enter(searchLoc.prefix, getFakerData("prefix"));
  await this.enter(searchLoc.suffix, getFakerData("suffix"));
  await this.getLocator(searchLoc.birthCountry).click();
  await this.page
    .getByText(getFakerData("country"), { exact: true })
    .click();
  await this.getLocator(searchLoc.idType).click();
  await this.page
    .getByText(getFakerData("insuredid"), { exact: true })
    .click();
  await this.enter(searchLoc.nationalId, getFakerData("insuredid"));
}
  }

}

/**
 * Click on the "Create" button in the modal after filling out the insured form.
 * @param insuredType - The type of insured (New / Existing).
 */
async clickCreateButtonInModal(insuredType: string) {
  let successmessage: string = "";

  await this.click(searchLoc.clickCreateButton);
  await this.waitForVisibility(searchLoc.successMessage);

  if (insuredType === "New") {
    // Checking new insured success message
    successmessage = await this.getLocator(
      searchLoc.successMessage
    ).textContent();

    logger.info(`Success Message: ${successmessage}`);
    expect(successmessage).toMatch(/Insured with id:\d+ was created./);
  } else {
    // Checking new Alias success message
    await this.page.locator(searchLoc.aliasSuccessMessage_locator).waitFor({
      state: 'visible',
      timeout: 8000,
    });

    successmessage = await this.getLocator(
      searchLoc.aliasSuccessMessage
    ).textContent();

    logger.info(`Success Message: ${successmessage}`);
    expect(successmessage).toMatch(/Insured alias with id:\d+ was created./);
  }

  // Capturing the Newly created Insured/Alias ID
  const id = successmessage?.match(/id:(\d+)/)?.[1];
  logger.info(`Extracted ID: ${id}`);

  expect
    .soft(await this.getText(searchLoc.standaloneTitle_locator), "Search")
    .toBeTruthy();
}

}
