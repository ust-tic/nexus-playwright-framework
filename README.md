# RGA Asia - Nexus Test QA Framework

This repository contains the Playwright + TypeScript based automation framework for Nexus Underwriting Application.

## Features

- Page Object Model (POM)
- Role-based login (Underwriter, Admin, CMO, etc.)
- Multi-environment support (QA, UAT, Pre-Prod)
- Dynamic test data using Faker/JSON
- Tagged test runs (sanity, regression, smoke)
- Allure reporting with screenshots
- CI/CD ready (Jenkins, Azure DevOps)

## How to Run

```bash
npx playwright test --grep @sanity
