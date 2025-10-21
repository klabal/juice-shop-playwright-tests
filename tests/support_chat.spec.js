import { test, expect } from '@playwright/test';  

test('Support Chat Functionality', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=Support');
    await expect(page.locator('div#chat-window')).toBeVisible();
});