import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Cart functionality', () => {
    test('add item to cart and verify', async ({ page }) => {
        const loginPage = new LoginPage(page);
                await loginPage.goto();
                await loginPage.login('test@example.com', 'Test123-');
        const productPage = new ProductPage(page);
        await productPage.goto();
        await page.locator('mat-card').filter({ hasText: 'Apple Juice (1000ml)1.99¤Add' }).getByLabel('Add to Basket').click();
        await productPage.addItemToCartByIndex(0);
        await productPage.openCart();
        await expect(page.locator('.mat-table')).toContainText('Quantity');
    });
});