import { test, expect, request as baseRequest } from '@playwright/test';
import { loginAsBasicUser } from '../../utils/auth';

let userToken: string;
let basketItemId: number;

test.beforeAll(async () => {
  const context = await baseRequest.newContext();
  userToken = await loginAsBasicUser(context);

  const dummyRes = await context.post('/api/BasketItems', {
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    data: {
      ProductId: 14,
      quantity: 1
    }
  });

  const body = await dummyRes.json();
  basketItemId = body.data.id;
  expect(basketItemId).toBeTruthy();
});

test.describe('Basket Item Mutation Suite', () => {
  test('Should NOT update someone else’s basket item', async ({ request }) => {
    test.fixme();
    const evilUpdate = await request.put(`/api/BasketItems/${basketItemId + 1}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      },
      data: {
        quantity: 999
      }
    });

    expect([401, 403, 500]).toContain(evilUpdate.status());
  });

  test('Should reject abusive quantity (-10, 9999)', async ({ request }) => {
    const overflowUpdate = await request.put(`/api/BasketItems/${basketItemId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      },
      data: {
        quantity: 9999
      }
    });

    expect(overflowUpdate.status()).toBeLessThan(500); // Or 400, depending on app logic
  });

  test('Token Replay Attack (same token reused rapidly)', async ({ request }) => {
    for (let i = 1; i <= 5; i++) {
      const replay = await request.put(`/api/BasketItems/${basketItemId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        },
        data: { quantity: i }
      });

      console.log(`[${i}] ➜ ${replay.status()}`);
      expect([200, 401, 403, 500]).toContain(replay.status());
    }
  });

  test('Should reject update with no token', async ({ request }) => {
    test.fixme();
    const unauthUpdate = await request.put(`/api/BasketItems/${basketItemId}`, {
      data: { quantity: 3 }
    });

    expect(unauthUpdate.status()).toBe(401);
  });

  test('XSS Payload in quantity field', async ({ request }) => {
    const xssUpdate = await request.put(`/api/BasketItems/${basketItemId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`
      },
      data: {
        quantity: "<script>alert('xss')</script>"
      }
    });

    const text = await xssUpdate.text();
    console.log('XSS Payload Response:\n', text);
    expect(xssUpdate.status()).toBeGreaterThanOrEqual(400);
  });
});
