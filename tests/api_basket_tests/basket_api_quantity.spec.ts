import { test, expect, request, APIRequestContext } from '@playwright/test';

let context: APIRequestContext;
let userToken: string;
let basketId: number;

async function loginAsBasicUser(apiContext: APIRequestContext): Promise<string> {
  const loginRes = await apiContext.post('http://localhost:3000/rest/user/login', {
    data: {
      email: 'jim@juice-sh.op',
      password: 'ncc-1701',
    },
  });

  const loginJson = await loginRes.json();
  const token = loginJson?.authentication?.token;

  if (!token) throw new Error('❌ Failed to retrieve token from login response');

  console.log(`🔐 Logged in as Jim. Token: ${token.slice(0, 12)}...`);
  return token;
}

test.beforeAll(async () => {
  context = await request.newContext();
  userToken = await loginAsBasicUser(context);

  // Force Basket creation by adding a dummy product
  const dummyAddRes = await context.post('http://localhost:3000/api/BasketItems', {
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    data: {
      ProductId: 1,
      quantity: 1,
    },
  });

  const dummyJson = await dummyAddRes.json();
  console.log('🧪 Dummy BasketItem Response:', dummyJson);

  // Retrieve basket items and extract basketId
  const itemsRes = await context.get('http://localhost:3000/api/BasketItems', {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  const itemsJson = await itemsRes.json();
  const firstItem = itemsJson?.data?.[0];

  if (!firstItem?.BasketId) {
    console.error('💀 Full BasketItems response:\n', itemsJson);
    throw new Error('🧨 No BasketId found in BasketItems');
  }

  basketId = firstItem.BasketId;
  console.log(`🧺 Inferred BasketId: ${basketId}`);
});

test.describe('🧺 Basket API Tests - Isolated', () => {
  test('✅ Add item to basket', async () => {
    const addRes = await context.post('http://localhost:3000/api/BasketItems', {
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        BasketId: basketId,
        ProductId: 12,
        quantity: 3,
      },
    });

    const addJson = await addRes.json();
    console.log('📦 Basket Add Response:', addJson);

    expect(addJson?.data?.BasketId).toBe(basketId);
    expect(addJson?.data?.ProductId).toBe(12);
    expect(addJson?.data?.quantity).toBe(3);
  });
});
