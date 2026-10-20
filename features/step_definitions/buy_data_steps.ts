import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { FlashWorld } from '../support/world';
import { submitPurchaseForm, REFERENCE, BALANCE } from '../support/helpers';

// Steps that belong only to features/buy_data.feature.
// Shared steps (Background, enter number, select bundle, click, message) live in common_steps.ts.

// --- GIVEN STEPS ---
Given('{int} data bundles have already been purchased via the API for this account', async function (this: FlashWorld, count: number) {
  for (let i = 0; i < count; i++) {
    await this.apiClient!.post(`/api/accounts/${this.accountId}/bundles`, {
      data: {
        mobileNumber: '0821234567',
        bundleCode: 'D500MB'
      }
    });
  }
});

// --- WHEN STEPS ---
When('I purchase the following bundles sequentially:', async function (this: FlashWorld, dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    await submitPurchaseForm(this, row.mobileNumber, row.bundle);
    await this.page!.waitForTimeout(500);
  }
});

// --- THEN STEPS ---
Then('a valid purchase reference is displayed', async function (this: FlashWorld) {
  const refEl = this.page!.locator(REFERENCE);
  await expect(refEl).toBeVisible();
  await expect(refEl).toContainText('Reference: DB-');
});

Then('the updated balance displays {string}', async function (this: FlashWorld, expectedBalance: string) {
  const balanceEl = this.page!.locator(BALANCE);
  await expect(balanceEl).toContainText(expectedBalance);
});

Then('the final balance displays {string}', async function (this: FlashWorld, expectedBalance: string) {
  const balanceEl = this.page!.locator(BALANCE);
  await expect(balanceEl).toContainText(expectedBalance);
});

Then('the purchase is recorded in the account history via API', async function (this: FlashWorld) {
  const response = await this.apiClient!.get(`/api/accounts/${this.accountId}/purchases`);
  expect(response.status()).toBe(200);
  const purchases = await response.json();
  expect(purchases.length).toBeGreaterThan(0);
});

Then('{int} purchases are confirmed in the API purchase history', async function (this: FlashWorld, expectedCount: number) {
  const response = await this.apiClient!.get(`/api/accounts/${this.accountId}/purchases`);
  expect(response.status()).toBe(200);
  const purchases = await response.json();
  expect(purchases.length).toBe(expectedCount);
});
