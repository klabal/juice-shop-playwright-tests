import { test, expect } from '@playwright/test';    

test('Open Product Page', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=Products');
    await page.click('text=Product Name');
    await expect(page).toHaveURL('http://localhost:3000/products/product-id');
});