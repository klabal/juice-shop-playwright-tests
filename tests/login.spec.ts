import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.ts';


test.describe('Login tests', () => {
    test('invalid login', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('demo', 'password');
       // await expect(page.locator('.mat-toolbar')).toContainText('OWASP Juice Shop');
    });

    test('invalid login shows error', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('invalid', 'wrong');
        await expect(page.locator('.error')).toBeVisible();
    });
    test('valid login', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('test@example.com', 'Test123-');
    //    await expect(page.locator('.mat-toolbar')).toContainText('OWASP Juice Shop');
    });
    test('valid login redirects to homepage', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
       // await expect(page).toHaveURL('http://localhost:3000/#/login');
        await page.pause();
    });
});