import fs from 'fs';
import path from 'path';
import type { TestInfo } from '@playwright/test';

/**
 * Loads scenario data from JSON file based on test name and file path.
 */
export async function getScenarioData(testTitle: string, specFilePath: string): Promise<any> {
  const fileName = path.basename(specFilePath).replace('.spec.ts', '');
  const jsonPath = path.resolve(__dirname, '../../..', 'testdata', `${fileName}.json`);

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Test data file not found: ${jsonPath}`);
  }

  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  if (!jsonData[testTitle]) {
    throw new Error(`Test data for "${testTitle}" not found in ${jsonPath}`);
  }

  return jsonData[testTitle];
}

/**
 * Returns the scenarioData attached to testInfo in beforeEach
 */
export function getScenario(testInfo: TestInfo): any {
  return (testInfo as any).scenarioData;
}
