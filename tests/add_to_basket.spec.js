import { test, expect } from '@playwright/test';

test('Login Functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/login');     
});
    test('should display login form', async ({ page }) => {
    const loginForm = await page.locator('form#login');
    await expect(loginForm).toBeVisible();
  });
    test('should login with valid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });
    test('should have add to basket functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/product/1');
    await page.click('button#add-to-basket');
    await expect(page.locator('div#basket')).toContainText('1 item');       
  });