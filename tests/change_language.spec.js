    import { test, expect } from '@playwright/test';

    test('Welcome banner - first open of page', async ({ page }) => {
        await page.goto('#/');
        await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
        await page.pause();  

    });

    test('Change Language Functionality', async ({ page }) => {
        await page.goto('#/');   
        await page.pause();  
         await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
        await page.getByRole('button', { name: 'Language selection menu' }).click();
        await page.locator('div').filter({ hasText: 'English' }).nth(5).click();
        await page.getByText('menu OWASP Juice Shop close').click();
        await page.pause();
    });
      //  test('should display language selector', async ({ page }) => {
      //  const languageSelector = await page.locator('select#language');
       // await expect(languageSelector).toBeVisible();
    //  });   