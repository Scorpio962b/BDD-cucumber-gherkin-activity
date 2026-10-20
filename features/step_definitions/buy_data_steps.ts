import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { FlashWorld } from '../support/world';

const BUNDLE_MAP: Record<string, string> = {
  '500MB': 'D500MB',
  '1GB': 'D1GB',
  '2GB': 'D2GB',
  '5GB': 'D5GB',
  '10GB': 'D10GB'
};

async function submitPurchaseForm(world: FlashWorld, mobile: string, bundle: string) {
  const page = world.page!;
  await page.fill('#mobileNumber, input[name="mobileNumber"]', mobile || '');

  if (bundle && bundle !== 'None') {
    const code = BUNDLE_MAP[bundle] || bundle;
    await page.selectOption('#bundleCode, select[name="bundleCode"]', code);
  } else {
    await page.selectOption('#bundleCode, select[name="bundleCode"]', '');
  }

  await page.click('button:has-text("Buy data"), #buyBtn');
}

// --- GIVEN STEPS ---
Given('a fresh account exists with a balance of {rand}', async function (this: FlashWorld, balance: string) {
  expect(this.accountId).toBeDefined();
  this.startingBalance = balance;
});


Given('I am on the Buy Data page for my account', async function (this: FlashWorld) {
  await this.page!.goto(`http://localhost:3003/data-bundle?account=${this.accountId}`);
});

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

Given('the purchase API service is returning a 500 error', async function (this: FlashWorld) {
  await this.page!.route('**/api/accounts/*/bundles', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ result: 'error', message: 'Internal Server Error' })
    });
  });
});

// --- WHEN STEPS ---
When('I enter the mobile number {string}', async function (this: FlashWorld, mobileNumber: string) {
  await this.page!.fill('#mobileNumber, input[name="mobileNumber"]', mobileNumber);
});

When('I select the bundle {string}', async function (this: FlashWorld, bundle: string) {
  if (bundle !== 'None') {
    const code = BUNDLE_MAP[bundle] || bundle;
    await this.page!.selectOption('#bundleCode, select[name="bundleCode"]', code);
  }
});

When('I click "Buy data"', async function (this: FlashWorld) {
  await this.page!.click('button:has-text("Buy data"), #buyBtn');
});

When('I purchase the following bundles sequentially:', async function (this: FlashWorld, dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    await submitPurchaseForm(this, row.mobileNumber, row.bundle);
    await this.page!.waitForTimeout(500);
  }
});

// --- THEN STEPS ---
Then('the page displays the message {string}', async function (this: FlashWorld, expectedMsg: string) {
  const messageEl = this.page!.locator('#message, .message');
  await expect(messageEl).toContainText(expectedMsg);
});

Then('a valid purchase reference is displayed', async function (this: FlashWorld) {
  const refEl = this.page!.locator('#reference, .reference');
  await expect(refEl).toBeVisible();
  await expect(refEl).toContainText('Reference: DB-');
});

Then('the updated balance displays {string}', async function (this: FlashWorld, expectedBalance: string) {
  const balanceEl = this.page!.locator('#balance, .balance');
  await expect(balanceEl).toContainText(expectedBalance);
});

Then('the final balance displays {string}', async function (this: FlashWorld, expectedBalance: string) {
  const balanceEl = this.page!.locator('#balance, .balance');
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

Given('the purchase API service is returning a 500 error', async function (this: FlashWorld) {
  // Intercept any POST calls to the purchase API endpoint
  await this.page!.route('**/api/accounts/*/bundles', async (route) => {
    // Fulfill the request immediately with a 500 status code
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ result: 'error', message: 'Internal Server Error' })
    });
  });
});