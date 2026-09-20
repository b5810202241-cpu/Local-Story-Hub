const { test, expect } = require('@playwright/test');

test('published-works page loads for a visitor with no login', async ({ page }) => {
  await page.goto('/published-works.html');
  await expect(page).toHaveTitle(/Local Story Hub/);
  await expect(page.locator('h1')).toHaveText('ผลงานนิสิตที่เผยแพร่แล้ว');
});
