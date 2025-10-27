import { APIRequestContext } from '@playwright/test';

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