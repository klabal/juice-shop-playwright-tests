// tests/search.spec.ts
import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { searchTerms } from '../utils/testData';


test.describe('Product search test suite', () => {
    test('search for "apple" shows relevant results', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.goto();
        await productPage.search('apple');
        const results = page.locator('.item-name');
        await expect(results.first()).toContainText(/apple/i);   
    });
  
    test('pagination appears when needed', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.goto();
        await productPage.search('');
        const pagination = page.locator('mat-paginator');
        await expect(pagination).toBeVisible();
    });


    test('highlighted text matches search term', async ({ page }) => {
        test.fixme();
        const productPage = new ProductPage(page);
        await productPage.goto();
        const term = 'apple';
        await productPage.search(term);
        const highlights = page.locator('mark');
        await expect(highlights.first()).toContainText(new RegExp(term, 'i'));
    });
    test.describe.configure({ mode: 'parallel' });
    test.describe('Search Stress Test Suite', () => {
        for (const term of searchTerms) {
            test(`Search term: "${term}"`, async ({ page }) => {
                const productPage = new ProductPage(page);
                await page.goto('#/'); // replace with actual URL
                await page.pause();

                await productPage.search(term);
                await page.pause();
                const results = await page.locator('.mat-grid-tile'); 
                const resultCount = await results.count();
                console.log(`Term: "${term}" → Results: ${resultCount}`);
                expect(resultCount).toBeGreaterThanOrEqual(0); // We just want it not to crash
            });
        }
    });
});