import { Given } from '@cucumber/cucumber';
import { FlashWorld } from '../support/world';

// Steps that belong only to features/server_error.feature.

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
