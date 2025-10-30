import { test, expect, request as globalRequest } from '@playwright/test';
import { Buffer } from 'buffer';

test('🧪 FULL Debug Login + Basket Fallback', async ({ request }) => {
  const loginRes = await request.post('/rest/user/login', {
    data: {
      email: 'jim@juice-sh.op',
      password: 'ncc-1701'
    }
  });

  const loginJson = await loginRes.json();
  const authToken = loginJson.authentication.token;
  const bid = loginJson.authentication.bid;

  expect(authToken).toBeTruthy();
  expect(bid).toBeGreaterThan(0);

  const basketRes = await request.get(`/rest/basket/${bid}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

  const basketJson = await basketRes.json();
  console.log('🧺 BASKET JSON:', basketJson);

expect(basketRes.status()).toBe(200);
expect(basketJson.data).toBeDefined();
expect(basketJson.data.id).toBe(bid);

});
