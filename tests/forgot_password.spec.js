import { test, expect } from '@playwright/test';  

test('Forgot Password Functionality', async ({ page }) => {
    await page.goto('https://juice-shop.herokuapp.com/#/forgot-password');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.click('button[type="submit"]');
    await expect(page.locator('div#forgot-password-success')).toBeVisible();
});

