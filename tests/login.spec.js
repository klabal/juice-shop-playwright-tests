import { test, expect } from '@playwright/test';

test('Login Functionality', async ({ page }) => {
    await page.goto('https://juice-shop.herokuapp.com/#//login');     
});

  test('should display login form', async ({ page }) => {
    const loginForm = await page.locator('form#login');
   // await expect(loginForm).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('https://juice-shop.herokuapp.com/#/dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    const errorMessage = await page.locator('text=Invalid email or password');
    //await expect(errorMessage).toBeVisible();
  });

  test('should redirect to signup page', async ({ page }) => {
    await page.click('text=Sign Up');
    await expect(page).toHaveURL('https://juice-shop.herokuapp.com/#/signup');
  });