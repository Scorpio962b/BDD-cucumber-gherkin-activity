import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, APIRequestContext } from 'playwright';

export interface CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  apiClient?: APIRequestContext;
  accountId?: string;
  startingBalance?: string;
}

export class FlashWorld extends World implements CustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  apiClient?: APIRequestContext;
  accountId?: string;
  startingBalance?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(FlashWorld);