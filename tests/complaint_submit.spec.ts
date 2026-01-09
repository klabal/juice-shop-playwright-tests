import { test, request, expect, Page, APIRequestContext } from '@playwright/test';
import { loginAsBasicUser, loginAsBasicUserViaUi } from '../utils/auth';


test('Submit Complaint and Check Admin Feedback for XSS Payload', async ({ page}) => {

await page.goto('https://juice-shop.herokuapp.com/');
const closeBtn = page.locator('button[aria-label="Close Welcome Banner"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }

  // --- User submits complaint ---
  const token = await loginAsBasicUserViaUi(page);
  
 // Fill and submit the form

  await page.goto('#/complain');
  

  // Fill in the complaint message  
  await page.getByRole('textbox', { name: 'Field for entering the' }).click();
  await page.getByRole('textbox', { name: 'Field for entering the' }).fill('<script>alert("XSS test")</script>');


// Check the checkbox if it's required (some versions need this)
const checkbox = page.locator('mat-checkbox[formcontrolname="rating"]');
if (await checkbox.isVisible()) {
  await checkbox.click();
}

// find the <input type="file"> on the complaint form
const fileInput = page.locator('input[type="file"]');

await page.locator('input[type="file"]').setInputFiles({
  name: 'suspicious_attachment.pdf',
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n%🕷️FakePDFData\n') // minimal fake content
})

// optional: verify the UI reacted
//await expect(page.locator('text=attachment')).toBeVisible();

//  Click the submit button
await page.click('button[type="submit"]');
//await page.pause();

// Confirm submission succeeded (usually toast or redirect)
//await expect(page.getByText('Customer support will get in'));
 
});
