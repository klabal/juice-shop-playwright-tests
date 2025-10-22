// tests/search.spec.ts
import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage.ts';


test.describe('Product search', () => {
    test('search for "apple" shows relevant results', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.goto();
        await productPage.search('apple');
        const results = page.locator('.item-name');
        await expect(results.first()).toContainText(/apple/i);

       // const results = page.locator('.mat-mdc-form-field-infix').first().click()   
        //const results = page.locator('#mat-input-1').first().click();
       // const results =page.getByText('search').click();
      //  await page.locator('#mat-input-1').fill('apple');
      //  await page.locator('#mat-input-1').press('Enter');
        
    });
    test('pagination appears when needed', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.goto();
        await productPage.search('');
        const pagination = page.locator('mat-paginator');
        await expect(pagination).toBeVisible();
    });


    test('highlighted text matches search term', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.goto();
        const term = 'apple';
        await productPage.search(term);
        const highlights = page.locator('mark');
        await expect(highlights.first()).toContainText(new RegExp(term, 'i'));
    });
});