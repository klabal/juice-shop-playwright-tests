import { test, expect } from '@playwright/test';

test('Login functionality open site', async ({ page }) => {
    await page.goto('https://juice-shop.herokuapp.com/#/'); 
});
    test('should display registration form and submit user registration information', async ({ page }) => {
      await page.goto('https://juice-shop.herokuapp.com/#/');
      await page.pause();
      await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
      await page.pause();
      await page.getByRole('button', { name: 'Show/hide account menu' }).click();
      await page.getByRole('menuitem', { name: 'Go to login page' }).click();
      await page.goto('/#/login');
      await page.getByRole('link', { name: 'Not yet a customer?' }).click();
      //await expect(page.getByRole('heading', { name: 'User Registration' })).toBeVisible();
      await page.goto('/#/register');
      await page.getByRole('textbox', { name: 'Email address field' }).click();
      await page.getByRole('textbox', { name: 'Email address field' }).fill('test2@example.com');
      await page.getByRole('textbox', { name: 'Email address field' }).press('Tab');
      await page.getByRole('textbox', { name: 'Field for the password' }).fill('admin123');
      await page.getByRole('textbox', { name: 'Field for the password' }).press('Tab');
      await page.getByRole('textbox', { name: 'Field to confirm the password' }).fill('admin123');
      await page.getByRole('textbox', { name: 'Field to confirm the password' }).press('Tab');
      await page.getByRole('switch', { name: 'Show password advice' }).press('Tab');
      await page.locator('.mat-mdc-text-field-wrapper.mdc-text-field.mdc-text-field--outlined.mdc-text-field--focused > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').click();
      await expect(page.getByRole('listbox', { name: 'Selection list for the' })).toBeVisible();

      await page.getByText('Your eldest siblings middle').click();
      await page.locator('.mat-mdc-form-field.mat-mdc-form-field-type-mat-input.mat-form-field-appearance-outline.mat-form-field-hide-placeholder > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').click();
      await page.getByRole('textbox', { name: 'Field for the answer to the' }).fill('none');
      await page.getByRole('button', { name: 'Button to complete the' }).click();
      await page.click('button[type="submit"]');
  });
  //  test('should register with valid details', async ({ page }) => {
  //  await page.goto('http://localhost:3000/');  
   // await page.pause(); 
   // await page.fill('input[name="email"]', 'user@example.com');
    //await page.fill('input[name="password"]', 'password');
   // await page.fill('input[name="confirmPassword"]', 'password');
   // await page.click('button[type="submit"]');
   // await expect(page).toHaveURL('http://localhost:3000/dashboard');
 // });
    test('should show error with existing email', async ({ page }) => {
      await page.goto('https://juice-shop.herokuapp.com/#/');
      await page.pause();
      await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
      await page.pause();
      await page.getByRole('button', { name: 'Show/hide account menu' }).click();
      await page.getByRole('menuitem', { name: 'Go to login page' }).click();
      await page.goto('h#/login');
      await page.getByRole('link', { name: 'Not yet a customer?' }).click();
      //await expect(page.getByRole('heading', { name: 'User Registration' })).toBeVisible();
      await page.goto('#/register');
      await page.getByRole('textbox', { name: 'Email address field' }).click();
      await page.getByRole('textbox', { name: 'Email address field' }).fill('test2@example.com');
      await page.getByRole('textbox', { name: 'Email address field' }).press('Tab');
      await page.getByRole('textbox', { name: 'Field for the password' }).fill('admin123');
      await page.getByRole('textbox', { name: 'Field for the password' }).press('Tab');
      await page.getByRole('textbox', { name: 'Field to confirm the password' }).fill('admin123');
      await page.getByRole('textbox', { name: 'Field to confirm the password' }).press('Tab');
      await page.getByRole('switch', { name: 'Show password advice' }).press('Tab');
      await page.locator('.mat-mdc-text-field-wrapper.mdc-text-field.mdc-text-field--outlined.mdc-text-field--focused > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').click();
      await expect(page.getByRole('listbox', { name: 'Selection list for the' })).toBeVisible();

      await page.getByText('Your eldest siblings middle').click();
      await page.locator('.mat-mdc-form-field.mat-mdc-form-field-type-mat-input.mat-form-field-appearance-outline.mat-form-field-hide-placeholder > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').click();
      await page.getByRole('textbox', { name: 'Field for the answer to the' }).fill('none');
      await page.getByRole('button', { name: 'Button to complete the' }).click();
      await page.click('button[type="submit"]');
      const errorMessage = await page.locator('text=Email must be unique');
    
 });
    test('should show error with mismatched passwords', async ({ page }) => {
      await page.goto('http://www.juice-shop.heroku app.com/');
      await page.pause();
      await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
      await page.pause();
      await page.getByRole('button', { name: 'Show/hide account menu' }).click();
      await page.getByRole('menuitem', { name: 'Go to login page' }).click();
      await page.goto('#/login');
      await page.getByRole('link', { name: 'Not yet a customer?' }).click();
      //await expect(page.getByRole('heading', { name: 'User Registration' })).toBeVisible();
      await page.goto('#/register');
      await page.getByRole('textbox', { name: 'Email address field' }).click();
      await page.getByRole('textbox', { name: 'Email address field' }).fill('user1@example.com');
      await page.getByRole('textbox', { name: 'Email address field' }).press('Tab');
      await page.getByRole('textbox', { name: 'Field for the password' }).fill('password');
      await page.getByRole('textbox', { name: 'Field for the password' }).press('Tab');
      await page.getByRole('textbox', { name: 'Field to confirm the password' }).fill('differentpassword');
      await page.getByRole('textbox', { name: 'Field to confirm the password' }).press('Tab');
      await page.getByRole('switch', { name: 'Show password advice' }).press('Tab');
      await page.locator('.mat-mdc-text-field-wrapper.mdc-text-field.mdc-text-field--outlined.mdc-text-field--focused > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').click();
      await expect(page.getByRole('listbox', { name: 'Selection list for the' })).toBeVisible();
      await page.getByText('Your eldest siblings middle').click();
      await page.locator('.mat-mdc-form-field.mat-mdc-form-field-type-mat-input.mat-form-field-appearance-outline.mat-form-field-hide-placeholder > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix').click();
      await page.getByRole('textbox', { name: 'Field for the answer to the' }).fill('none');
      await page.getByRole('button', { name: 'Button to complete the' }).click();
      await page.click('button[type="submit"]');
      const errorMessage = await page.locator('text=Passwords do not match');
      //await expect(errorMessage).toBeVisible();
  });
    test('should redirect to login page', async ({ page }) => {
    await page.goto('/#/login');  
    await page.pause();
    await page.click('text=Already have an account? Log In');
    await expect(page).toHaveURL('#/login');
  });