import { test } from "@playwright/test";
import StandaloneSearchPage from "../pages/standaloneSearch.page";
import { GlobalThis } from "../hooks/hooks";
import { getFakerData } from "../../utils/data/fakerUtils";

/**
 * Creates a new insured in the standalone search page.
 * Common for Indian and Japan markets.
 * Uses faker to generate random but meaningful values for all fields.
 */
test('@wk @smoke @in @jp @common Standalone - Create Insured', async ({}, testInfo) => {
  GlobalThis.user = {
    firstName: getFakerData("firstName", "en"),
    lastName: getFakerData("lastName", "en"),
  };

  const insuredSearch = new StandaloneSearchPage(getPage());
  await insuredSearch.navigateToStandaloneSearchPage();
  await insuredSearch.searchInsured("NewInsured", GlobalThis.user);
  await insuredSearch.selectCreateNewInsured();
  await insuredSearch.fillInsuredForm(false, "New");
  await insuredSearch.clickCreateButtonInModal("New");
});

/**
 * Creates an alias for an existing insured in the standalone search page.
 * Uses faker to generate random but meaningful values for all fields.
 */
test('@smoke @in @jp @common Standalone - Create Alias', async ({}, testInfo) => {
  GlobalThis.user = {
    firstName: getFakerData("firstName", "en"),
    lastName: getFakerData("lastName", "en"),
  };

  const insuredSearch = new StandaloneSearchPage(getPage());
  await insuredSearch.navigateToStandaloneSearchPage();
  await insuredSearch.searchInsured("NewInsured", GlobalThis.user);
  await insuredSearch.selectCreateNewInsured();
  await insuredSearch.fillInsuredForm(false, "New");
  await insuredSearch.clickCreateButtonInModal("New");

  await insuredSearch.searchInsured("ExistingInsured", GlobalThis.user);
  await insuredSearch.clickNewAlias();
  await insuredSearch.fillInsuredForm(false, "Existing");
  await insuredSearch.clickCreateButtonInModal("Alias");
});

