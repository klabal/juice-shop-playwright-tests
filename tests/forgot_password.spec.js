import { test, expect } from '@playwright/test';  

test('Forgot Password Functionality', async ({ page }) => {
    test.fixme();
    await page.goto('#/forgot-password');
    await page.fill('input[name="email"]', 'jim@juice-sh.op');
    await page.click('button[type="submit"]');
    await expect(page.locator('div#forgot-password-success')).toBeVisible();
});

