import { FlashWorld } from './world';

// Maps the friendly bundle names used in Gherkin to the API bundle codes.
export const BUNDLE_MAP: Record<string, string> = {
  '500MB': 'D500MB',
  '1GB': 'D1GB',
  '2GB': 'D2GB',
  '5GB': 'D5GB',
  '10GB': 'D10GB'
};

// Locators taken from data-app/public/data-bundle.html
export const MOBILE_FIELD = '#mobile';
export const BUNDLE_LIST = '#bundle';
export const BUY_BUTTON = 'button:has-text("Buy data")';
export const MESSAGE = '[data-testid="purchase-message"]';
export const REFERENCE = '[data-testid="purchase-reference"]';
export const BALANCE = '[data-testid="wallet-balance"]';

// Shared helper (a normal function, not a step) that fills and submits the purchase form.
export async function submitPurchaseForm(world: FlashWorld, mobile: string, bundle: string) {
  const page = world.page!;
  await page.fill(MOBILE_FIELD, mobile || '');

  if (bundle && bundle !== 'None') {
    const code = BUNDLE_MAP[bundle] || bundle;
    await page.selectOption(BUNDLE_LIST, code);
  } else {
    await page.selectOption(BUNDLE_LIST, '');
  }

  await page.click(BUY_BUTTON);
}
