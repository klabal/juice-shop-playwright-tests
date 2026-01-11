import { test, expect, request, APIRequestContext } from '@playwright/test';

let authReq: APIRequestContext;
let token: string;
let myOrderId: any;
let someoneElsesOrderId: any;

test.describe('📦 Order Status API™', () => {

  test.beforeAll(async ({ baseURL }) => {
    const reqContext = await request.newContext();

    const loginRes = await reqContext.post(`${baseURL}/rest/user/login`, {
      data: { email: 'admin@juice-sh.op', password: 'admin123' }
    });

    const loginJson = await loginRes.json();
    token = loginJson.authentication?.token;
    console.log('🔑 Token:', token);

    authReq = await request.newContext({
      baseURL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // 🛒 Add item to basket
    await authReq.post(`/api/BasketItems`, {
      data: {
        ProductId: 1, // e.g. Apple Juice
        quantity: 1
      }
    });

    // 🧾 Place order
    const orderRes = await authReq.post(`/api/Orders`, {
      data: {
        addressId: 1,
        deliveryMethodId: 1,
        paymentId: 1
      }
    });

    // Fetch placed orders
    //const rawText = await ordersFetch.text();

   const ordersFetch = (await authReq.get(`/rest/orders`));
   console.log('🩸 /rest/orders status:', ordersFetch.status());

   // console.log('📦 Raw /rest/orders response:', rawText.slice(0, 200)); // Don't dump full HTML
 try{
    const ordersJson = await ordersFetch.json();
    const orders = ordersJson?.data || [];

    myOrderId = orders?.[0]?.id;
    someoneElsesOrderId = orders?.[1]?.id;

    console.log('✅ Real My Order ID:', myOrderId);
 }
    catch(e)
    {
         console.error('❌ Failed to parse JSON. Response was HTML.');
        throw e;
    }

    console.log('✅ Someone Else\'s Order ID:', someoneElsesOrderId);
  });

  test('🍸 Order Injection – View All Orders', async ({ request }) => {
    test.fixme();
    const res = await request.get(`/rest/track-order/'%20%7C%7C%20true%20%7C%7C%20'`);
    expect(res.status()).toBe(200);

    const body = await res.json();
    console.log('🧾 All Orders:', body);

    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(1);
  });

  test('Update Own Order Status to Delivered', async () => {
    console.log('🕷️ About to PUT to:', `/rest/orders/${myOrderId}`);
    const res = await authReq.put(`/rest/orders/${myOrderId}`, {
      data: { delivered: true },
    });

    const statusCode = res.status();
    const body = await res.text();
    console.log('Status Code:', statusCode);
    console.log('Body:', body);

    expect(statusCode).toBe(200);
    const json = JSON.parse(body);
    expect(json?.data?.delivered).toBe(true);
    console.log('📦 Order updated to delivered ✔️');
  });

  test('Try Updating Another User’s Order', async () => {
    const res = await authReq.put(`/rest/orders/${someoneElsesOrderId}`, {
      data: { delivered: false },
    });

    expect(res.status()).not.toBe(200);
    console.log('🚷 Attempt to hijack another order was rejected? Status:', res.status());
  });

  test('Send Invalid Delivered Values', async () => {
    const junkData = [
      { delivered: 'shippedToJupiter' },
      { delivered: 12345 },
      { delivered: null },
      {},
    ];

    for (const junk of junkData) {
      const res = await authReq.put(`/rest/orders/${myOrderId}`, {
        data: junk,
      });
      console.log(`🧪 Sent ${JSON.stringify(junk)} => Status: ${res.status()}`);
    }
  });

  test('Invalid or Missing Order ID', async () => {
    test.fixme();
    const badIds = [' ', 'null', 'undefined', '💩'];

    for (const id of badIds) {
      const res = await authReq.put(`/rest/orders/${id}`, {
        data: { delivered: true },
      });
      console.log(`🚨 Tried updating order ID "${id}" => Status: ${res.status()}`);
    }
  });

  test('No Auth Token Should Fail', async ({ baseURL }) => {
    const context = await request.newContext();
    const res = await context.put(`${baseURL}/rest/orders/${myOrderId}`, {
      data: { delivered: false },
    });

    expect(res.status()).toBeGreaterThanOrEqual(401);
    console.log('🔒 No-token update blocked? Status:', res.status());
  });

  test('Replay Attack with Same Token', async () => {
    for (let i = 0; i < 3; i++) {
      const res = await authReq.put(`/rest/orders/${myOrderId}`, {
        data: { delivered: true },
      });
      console.log(`🔁 Replay #${i + 1} => Status: ${res.status()}`);
    }
  });

  test('Inject XSS Payload into Delivered Field', async () => {
    const res = await authReq.put(`/rest/orders/${myOrderId}`, {
      data: { delivered: "<script>alert('Owned')</script>" },
    });

    console.log('👀 XSS attempt status:', res.status());
    const body = await res.text();
    if (body.includes('script')) {
      console.warn('🧨 XSS reflection detected!');
    } else {
      console.log('✅ No reflection.');
    }
  });
});

