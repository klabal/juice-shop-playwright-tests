import { expect, Page, APIRequestContext } from '@playwright/test';

export async function loginAsBasicUser(request: APIRequestContext):Promise<string> {
  const res = await request.post('http://localhost:3000/rest/user/login', {
    data: {
      email: 'jim@juice-sh.op',  // use a known non-admin
      password: 'ncc-1701'
    },
     headers: {
      'Content-Type': 'application/json',
    },
  });
  const bodyText = await res.text();
  try {
    const json = JSON.parse(bodyText);
    return json.authentication.token;
  } catch (err) {
    console.error('Failed to parse response:', bodyText);
    throw new Error('Login failed for basic user');
  }

}

// For UI tests
export async function loginAsBasicUserViaUi(page: Page) {
  await page.goto('http://localhost:3000/#/login');
  await page.fill('#email', 'jim@juice-sh.op');
  await page.fill('#password', 'ncc-1701');
  await page.click('#loginButton');
  await expect(page).toHaveURL(/\/#/);
   // Navigate directly after login
  await page.goto('http://localhost:3000/#/complain');
 // await expect(page).toHaveURL(/\/complain/);
  // await page.pause();
}


export async function loginAsAdmin(page: Page) {
  await page.goto('http://localhost:3000/#/login')
  await page.fill('#email', 'admin@juice-sh.op')
  await page.fill('#password', 'admin123') // or whatever creds you use
  await page.locator('#loginButton').click()
  await expect(page).toHaveURL(/\/#/);
}
