# Activity Answers & Written Requirements

## Task 5: Playwright Locators Selection Strategy
| Element | Selected Locator Strategy | Justification |
|---|---|---|
| **Mobile Number Field** | `#mobileNumber, input[name="mobileNumber"]` | Uses standard ID with fallback name attribute for reliable field selection. |
| **Bundle Dropdown List** | `#bundleCode, select[name="bundleCode"]` | Selects `<select>` directly to interact with native Playwright `.selectOption()`. |
| **Buy Data Button** | `button:has-text("Buy data"), #buyBtn` | Combines visible user text matching with fallback element ID. |
| **Message Label** | `#message, .message` | Unique element container where success/error notification banners render. |
| **Reference Label** | `#reference, .reference` | Selector for transaction reference display (e.g. `Reference: DB-000001`). |
| **Balance Label** | `#balance, .balance` | Component displaying live wallet balance text. |

## Task 11: Reused Step Definition Proof
**Reused Step**: `When I click "Buy data"` (implemented in `buy_data_steps.ts`).
Both `features/buy_data.feature` and `features/rules_validation.feature` reuse this exact step definition, as well as `When I enter the mobile number {string}` and `Then the page displays the message {string}`.

## Task 12: Tagged Execution Counts
- `npm run test:smoke`: Runs **3 scenarios** (1 core scenario + 2 Accepted Examples rows).
- `npm run test:negative`: Runs **8 scenarios** (1 daily limit scenario + 6 Rejected Examples rows + 1 server 500 scenario).

## Task 14: Intentional Broken Checks & Typo Explanations
1. **Broken Assertion Observation**: Changing expected balance to "250.00" caused step `Then the updated balance displays "250.00"` to fail because the app calculated `201.00` (R300.00 starting balance minus R99.00 for 1GB). The test assertion was wrong; the application arithmetic was correct.
2. **Gherkin Typo Explanation**: Typos (e.g., "I buys") should be fixed directly in the feature file rather than pasting Cucumber's suggested snippet. Pasting suggested snippets creates duplicate step definitions, pollutes the codebase, and violates Gherkin's plain-language reusability principles.

## Task 15: Definition of Done Checklist
- [x] Folder structure initialized with TypeScript and Cucumber config.
- [x] Feature files written in plain Gherkin format.
- [x] At least 3 scenarios and 1 Scenario Outline with 8 Example rows across 2 tagged tables.
- [x] Business rules 1, 2, 3, and 4 fully tested.
- [x] Step definitions reused without internal step-to-step calls.
- [x] Isolated API account creation handled in `Before` hook.
- [x] `npm test`, `npm run test:smoke`, and `npm run test:negative` configured and working.
- [x] HTML, JSON, and JUnit reports generated with screenshot attachment on failure.

## Stretch Challenge 3: Scenario Outline vs. External JSON File
For 50 test cases, keeping them in an external JSON file is preferable over a 50-row Gherkin Examples table. A 50-row table cluttering the feature file reduces readability for non-technical stakeholders and obscures business intent. Externalizing data into JSON cleanly separates test logic from data management, allowing dynamic iteration over data arrays while keeping feature files concise and focused.
