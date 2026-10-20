import { BeforeAll, AfterAll, Before, After, Status } from '@cucumber/cucumber';
import { chromium, Browser, request } from 'playwright';
import { FlashWorld } from './world';

let globalBrowser: Browser;

BeforeAll(async function () {
  globalBrowser = await chromium.launch({ headless: true });
});

Before(async function (this: FlashWorld) {
  this.browser = globalBrowser;
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  this.apiClient = await request.newContext({
    baseURL: 'http://localhost:3003'
  });

  // Generate an isolated account via API per scenario
  const response = await this.apiClient.post('/api/accounts', {
    data: { startingBalance: '300.00' }
  });

  const body = await response.json();
  this.accountId = body.accountId;
  this.startingBalance = body.balance;
});

After(async function (this: FlashWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, 'image/png');
  }

  if (this.page) await this.page.close();
  if (this.context) await this.context.close();
  if (this.apiClient) await this.apiClient.dispose();
});

AfterAll(async function () {
  if (globalBrowser) {
    await globalBrowser.close();
  }
});
