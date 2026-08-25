# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/e2e.spec.js >> add watch and view details
- Location: tests/e2e.spec.js:3:1

# Error details

```
TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('text=PWTestBrand PWTestModel') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "Watch Inventory" [level=1] [ref=e4]
  - generic [ref=e5]:
    - textbox "Search text" [ref=e6]
    - button "Search" [ref=e7]
    - textbox "Search SKU" [ref=e8]
    - button "Search SKU" [ref=e9]
    - button "Clear" [ref=e10]
  - generic [ref=e11]:
    - textbox "Filter brand" [ref=e12]
    - textbox "Filter model" [ref=e13]
    - button "Apply" [ref=e14]
  - generic [ref=e15]:
    - heading "Add watch" [level=2] [ref=e16]
    - textbox "Brand" [ref=e17]: PWTestBrand
    - textbox "Model" [ref=e18]: PWTestModel
    - spinbutton "Price" [ref=e19]: "199.99"
    - spinbutton "Stock" [ref=e20]: "5"
    - textbox "SKU" [ref=e21]: PW-SKU-001
    - textbox "Description" [ref=e22]: Playwright E2E test item
    - generic [ref=e23]:
      - button "Add watch" [active] [ref=e24]
      - button "Refresh" [ref=e25]
  - generic [ref=e26]:
    - button "Export CSV" [ref=e27]
    - button "Choose File" [ref=e28]
  - heading "Inventory" [level=2] [ref=e29]
  - generic [ref=e30]: "TypeError: Failed to fetch"
  - list
  - generic [ref=e31]:
    - button "Prev" [ref=e32]
    - generic [ref=e33]: Page 1
    - button "Next" [ref=e34]
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('add watch and view details', async ({ page }) => {
  4  |   await page.goto(process.env.FRONTEND_URL || 'http://localhost:3002');
  5  | 
  6  |   // Fill add form
  7  |   await page.fill('input[placeholder="Brand"]', 'PWTestBrand');
  8  |   await page.fill('input[placeholder="Model"]', 'PWTestModel');
  9  |   await page.fill('input[placeholder="Price"]', '199.99');
  10 |   await page.fill('input[placeholder="Stock"]', '5');
  11 |   await page.fill('input[placeholder="SKU"]', 'PW-SKU-001');
  12 |   await page.fill('input[placeholder="Description"]', 'Playwright E2E test item');
  13 | 
  14 |   await page.click('button:has-text("Add watch")');
  15 | 
  16 |   // Wait for the item to appear in the list
> 17 |   await page.waitForSelector(`text=PWTestBrand PWTestModel`, { timeout: 5000 });
     |              ^ TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
  18 |   const item = await page.locator(`text=PWTestBrand PWTestModel`).first();
  19 |   await expect(item).toBeVisible();
  20 | 
  21 |   // Open details
  22 |   await page.locator('button:has-text("View")').first().click();
  23 |   await page.waitForSelector(`text=Details: PWTestBrand PWTestModel`);
  24 |   await expect(page.locator(`text=Details: PWTestBrand PWTestModel`)).toBeVisible();
  25 | });
  26 | 
```