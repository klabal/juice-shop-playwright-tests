import { test, expect } from '@playwright/test';  

test('Forgot Password Functionality', async ({ page }) => {
    await page.goto('#/forgot-password');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.click('button[type="submit"]');
    await expect(page.locator('div#forgot-password-success')).toBeVisible();
});

