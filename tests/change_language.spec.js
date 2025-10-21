    import { test, expect } from '@playwright/test';

    test('Change Language Functionality', async ({ page }) => {
        await page.goto('http://localhost:3000');     
    });
        test('should display language selector', async ({ page }) => {
        const languageSelector = await page.locator('select#language');
        await expect(languageSelector).toBeVisible();
      });   