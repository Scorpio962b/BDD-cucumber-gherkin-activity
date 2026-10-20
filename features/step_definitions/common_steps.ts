import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { FlashWorld } from '../support/world';
import { BUNDLE_MAP, MOBILE_FIELD, BUNDLE_LIST, BUY_BUTTON, MESSAGE } from '../support/helpers';

// Steps used by more than one feature file (all three share the Background and the purchase actions).

// --- GIVEN STEPS ---
Given('a fresh account exists with a balance of {rand}', async function (this: FlashWorld, balance: string) {
  expect(this.accountId).toBeDefined();
  this.startingBalance = balance;
});

Given('I am on the Buy Data page for my account', async function (this: FlashWorld) {
  await this.page!.goto(`http://localhost:3003/data-bundle?account=${this.accountId}`);
});

// --- WHEN STEPS ---
When('I enter the mobile number {string}', async function (this: FlashWorld, mobileNumber: string) {
  await this.page!.fill(MOBILE_FIELD, mobileNumber);
});

When('I select the bundle {string}', async function (this: FlashWorld, bundle: string) {
  if (bundle !== 'None') {
    const code = BUNDLE_MAP[bundle] || bundle;
    await this.page!.selectOption(BUNDLE_LIST, code);
  }
});

When('I click "Buy data"', async function (this: FlashWorld) {
  await this.page!.click(BUY_BUTTON);
});

// --- THEN STEPS ---
Then('the page displays the message {string}', async function (this: FlashWorld, expectedMsg: string) {
  const messageEl = this.page!.locator(MESSAGE);
  await expect(messageEl).toContainText(expectedMsg);
});
