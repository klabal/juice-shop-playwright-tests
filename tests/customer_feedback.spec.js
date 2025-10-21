import { test, expect } from '@playwright/test'; 

test('Customer Feedback Form', async ({ page }) => {
    await page.goto('http://localhost:3000/feedback');
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('textarea[name="message"]', 'Great service!');
    await page.click('button[type="submit"]');
    await expect(page.locator('div#feedback-success')).toBeVisible();
});