import { test, expect } from '@playwright/test';

test('💳 Full checkout flow via UI (polished chaos edition)', async ({ page }) => {
  // 🔐 Login
  await page.goto('http://localhost:3000/#/login');
  const closeBtn = page.locator('button[aria-label="Close Welcome Banner"]');
  if (await closeBtn.isVisible()) await closeBtn.click();

  await page.getByRole('textbox', { name: 'Text field for the login email' }).click();
  await page.getByRole('textbox', { name: 'Text field for the login email' }).fill('jim@juice-sh.op');
  await page.getByRole('textbox', { name: 'Text field for the login password' }).click();
  await page.getByRole('textbox', { name: 'Text field for the login password' }).fill('ncc-1701');
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/.*\/#\/search/);

  //  Add product to basket
  await page.pause();
 // await page.getByText('Apple Juice (1000ml)', { exact: false }).click();
  await page.locator('mat-card').filter({ hasText: 'Apple Juice (1000ml)1.99¤Add' }).getByLabel('Add to Basket').click();
 // await page.locator('button[aria-label="Back"]', { hasText: 'Back' }).click();
  await page.getByRole('button', { name: 'Show the shopping cart' }).click();
  await expect(page).toHaveURL(/.*\/#\/basket/);

  //  Begin checkout
  await page.getByText('Checkout').click();

  // 📦 Add new address if none
  const addressSection = page.locator('app-address-select');


   // 🧮 Capture count before adding
  const existingAddressCount = await addressSection.locator('mat-radio-button').count();

  if (existingAddressCount === 0) {
    await page.getByText('Add New Address').click();
    await page.getByPlaceholder('Please provide a country.').fill('USA');
    await page.getByPlaceholder('Please provide a name.').fill('Test Tester');
    await page.getByPlaceholder('Please provide a mobile number.').fill('6666666666');
    await page.getByPlaceholder('Please provide a ZIP code.').fill('12345');
    await page.getByPlaceholder('Please provide an address.').fill('123 Test');
    await page.getByPlaceholder('Please provide a city.').fill('Testville');
    await page.getByPlaceholder('Please provide a state.').fill('Test');
    await page.getByText('Submit').click();

    // ✅ Confirm address count increased
    await expect(addressSection.locator('mat-radio-button')).toHaveCount(existingAddressCount + 1);
  }

  // ✅ Select address
  await addressSection.locator('mat-radio-button').first().click();
  await page.getByText('Continue').click();

  // 🚚 Delivery selection
  const deliverySection = page.locator('app-delivery-method');
  await deliverySection.locator('mat-radio-button').first().click();
  await page.pause();
  await page.getByRole('button', { name: 'dismiss cookie message' }).click();
  await page.getByText('Continue').click();

  // 💰 Payment
  const paymentSection = page.locator('app-payment-method');
  if (await paymentSection.locator('mat-radio-button').count() === 0) {
    await page.getByText('Add new card').click();
    await page.getByPlaceholder('Please enter your card number').fill('1234123412341234');
    await page.getByPlaceholder('Please enter your name').fill('Test Tester');
    await page.getByPlaceholder('MM/YY').fill('12/31');
    await page.getByPlaceholder('CVC').fill('123');
    await page.getByText('Submit').click();
    await expect(paymentSection.locator('mat-radio-button')).toHaveCount(1);
  }

  await paymentSection.locator('mat-radio-button').first().click();
  await page.getByText('Continue').click();

  // 🎉 Finalize order
  await page.getByText('Place your order and pay').click();

  // ✅ Confirmation
  await expect(page.getByText(/Thank you for your purchase/i)).toBeVisible();
});
