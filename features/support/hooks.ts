import {
  BeforeAll,
  AfterAll,
  Before,
  After,
  Status,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { chromium, Browser, request } from "playwright";
import { FlashWorld } from "./world";

setDefaultTimeout(30 * 1000);

let globalBrowser: Browser;

BeforeAll(async function () {
  globalBrowser = await chromium.launch({ headless: true });
});

Before(async function (this: FlashWorld) {
  this.browser = globalBrowser;
  this.context = await this.browser.newContext();
  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true,
  });
  this.page = await this.context.newPage();

  this.apiClient = await request.newContext({
    baseURL: "http://localhost:3003",
  });

  // Generate an isolated account via API per scenario
  const response = await this.apiClient.post("/api/accounts", {
    data: { startingBalance: "300.00" },
  });

  const body = await response.json();
  this.accountId = body.accountId;
  this.startingBalance = body.balance;
});

After(async function (this: FlashWorld, { result, pickle }) {
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot();
    this.attach(screenshot, "image/png");
    const name = pickle.name.replace(/\W+/g, "-");
    await this.context.tracing.stop({ path: `reports/traces/${name}.zip` });
  } else {
    await this.context.tracing.stop();
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
