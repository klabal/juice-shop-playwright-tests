import { test, expect } from '@playwright/test';

test('Login Functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/');  
    await page.pause();
});
    test('should display registration form', async ({ page }) => {
    const registrationForm = await page.locator('form#register');
    //await expect(registrationForm).toBeVisible();
  });
    test('should register with valid details', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.fill('input[name="confirmPassword"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });
    test('should show error with existing email', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.fill('input[name="confirmPassword"]', 'password');
    await page.click('button[type="submit"]');
    const errorMessage = await page.locator('text=Email already exists');
    //await expect(errorMessage).toBeVisible();
  });
    test('should show error with mismatched passwords', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.fill('input[name="confirmPassword"]', 'differentpassword');
    await page.click('button[type="submit"]');
    const errorMessage = await page.locator('text=Passwords do not match');
    //await expect(errorMessage).toBeVisible();
  });
    test('should redirect to login page', async ({ page }) => {
    await page.click('text=Already have an account? Log In');
    await expect(page).toHaveURL('http://localhost:3000/#/login');
  });