const { test, expect } = require('@playwright/test');

test('add watch and view details', async ({ page }) => {
  await page.goto(process.env.FRONTEND_URL || 'http://localhost:3002');

  // Fill add form
  await page.fill('input[placeholder="Brand"]', 'PWTestBrand');
  await page.fill('input[placeholder="Model"]', 'PWTestModel');
  await page.fill('input[placeholder="Price"]', '199.99');
  await page.fill('input[placeholder="Stock"]', '5');
  await page.fill('input[placeholder="SKU"]', 'PW-SKU-001');
  await page.fill('input[placeholder="Description"]', 'Playwright E2E test item');

  await page.click('button:has-text("Add watch")');

  // Wait for the item to appear in the list
  await page.waitForSelector(`text=PWTestBrand PWTestModel`, { timeout: 5000 });
  const item = await page.locator(`text=PWTestBrand PWTestModel`).first();
  await expect(item).toBeVisible();

  // Open details
  await page.locator('button:has-text("View")').first().click();
  await page.waitForSelector(`text=Details: PWTestBrand PWTestModel`);
  await expect(page.locator(`text=Details: PWTestBrand PWTestModel`)).toBeVisible();
});
