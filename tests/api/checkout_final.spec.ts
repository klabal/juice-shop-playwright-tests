import { test, request, expect, APIRequestContext } from '@playwright/test';

let authReq: APIRequestContext;
let token: string;
let basketId: number;

test.beforeAll(async () => {
  const reqContext = await request.newContext();

  // Step 1: Login
  const loginRes = await reqContext.post('/rest/user/login', {
    data: {
      email: 'jim@juice-sh.op',
      password: 'ncc-1701'
    }
  });

  expect(loginRes.status()).toBe(200);

  const loginJson = await loginRes.json();
  token = loginJson?.authentication?.token;
  basketId = loginJson?.authentication?.bid;

  console.log('🔐 Token:', token);
  console.log('🧺 Basket ID:', basketId);

  if (!token || !basketId) {
    throw new Error('Login succeeded but token or basket ID missing');
  }

  // Step 2: Create authorized context
  authReq = await request.newContext({
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
});

test('Checkout flow™', async () => {
  // Step 3: Fetch basket
  const basketRes = await authReq.get(`/rest/basket/${basketId}`);

  const bodyText = await basketRes.text();

  // Step 4: Check for HTML response
  if (bodyText.trim().startsWith('<')) {
    console.error('🚨 HTML instead of JSON:\n', bodyText.slice(0, 300));
    throw new Error('Received HTML from basket endpoint. Possible auth or routing issue.');
  }

  // Step 5: Parse JSON
  const basketJson = JSON.parse(bodyText);
  console.log('✅ Basket JSON:', basketJson);

  // Step 6: Validate content
  expect(basketRes.status()).toBe(200);
  expect(basketJson?.data?.id).toBe(basketId);
  });

test('Add product to basket', async () => {
  // 1. Add Product to Basket
  const productRes = await authReq.post('/api/BasketItems/', {
    data: {
      ProductId: 1,
      BasketId: basketId,
      quantity: 1
    }
  });
  expect(productRes.status()).toBe(200);
  console.log('🧃 Product added.');

  // 2. Create Address
  const addressRes = await authReq.post('/api/Addresss', {
    data: {
      country: 'USA',
      name: 'Test tester',
      mobileNum: '1234567890',
      zipCode: '123-4567',
      streetAddress: 'Test avenue',
      city: 'Test',
      state: 'Test'
    }
  });
  const addressJson = await addressRes.json();
  const addressId = addressJson?.data?.id;
  expect(addressId).toBeDefined();
  console.log('📬 Address created:', addressId);

  // 3. Create Card
  const cardRes = await authReq.post('/api/Cards', {
    data: {
      fullName: 'Test tester',
      cardNum: '1234567812345678',
      expMonth: '12',
      expYear: '2099'
    }
  });
  const cardJson = await cardRes.json();
  const cardId = cardJson?.data?.id;
  expect(cardId).toBeDefined();
  console.log('💳 Card created:', cardId);

  // 4. Perform Checkout
  const checkoutRes = await authReq.post(`/rest/basket/${basketId}/checkout`, {
    data: {
      paymentId: cardId,
      addressId: addressId
    }
  });

  const checkoutJson = await checkoutRes.json();
  console.log('🧾 Checkout Result:', checkoutJson);

  expect(checkoutRes.status()).toBe(200);
  expect(checkoutJson.orderConfirmation).toBeDefined();
  console.log('✅ Checkout completed with orderConfirmation.');


});
