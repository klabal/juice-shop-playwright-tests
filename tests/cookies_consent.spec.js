import { test, expect } from '@playwright/test';                        

test('Cookies Consent', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const consentBanner = await page.locator('div#cookies-consent');
    await expect(consentBanner).toBeVisible();

    await page.click('button#accept-cookies');
    await expect(consentBanner).toBeHidden();
});
