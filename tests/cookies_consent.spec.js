import { test, expect } from '@playwright/test';                        

test('Cookies Consent', async ({ page }) => {
    await page.goto('https://juice-shop.herokuapp.com/#/');
    //const consentBanner = await page.locator('div#cookies-consent');  
    await page.pause();  
    await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
    await page.getByRole('button', { name: 'dismiss cookie message' }).click();
    await page.pause();
    //await expect(consentBanner).toBeHidden();
});
