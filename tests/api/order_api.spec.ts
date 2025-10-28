import { test, expect, request as globalRequest, APIRequestContext } from '@playwright/test';


const userCredentials = {
  email: 'jim@juice-sh.op',
  password: 'ncc-1701'
};

let token: string;
let userId: number;
let addressId: number;
let paymentId: number;
let basketId: number;
let api: APIRequestContext;

test.describe('Order API Tests - Jim Edition', () => {
  test.beforeAll(async ({ request }) => {
    const context = await globalRequest.newContext();

    // Login
    const loginRes = await context.post('/rest/user/login', {
      data: {
        email: 'jim@juice-sh.op',
        password: 'ncc-1701'
      }
    });
    
    const loginJson = await loginRes.json();
    token = loginJson.authentication.token;
    userId = loginJson.authentication.uid;
;
    // Auth context
    api = await globalRequest.newContext({
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
      const productRes = await api.get('/api/Products');
      const productJson = await productRes.json();
      const productId = productJson.data?.[0]?.id; // pick any valid product

    // 🧪 ADD ITEM to force basket creation
    console.log("Auth token being sent:", token);
    console.log('Product ID being added:', productId ?? '🚨 undefined');
    const basketItemRes = await api.post('/api/BasketItems', {
      data: {
        ProductId: productId,
        quantity: 1,
       // BasketId: basketId // No basket yet, backend will auto-create
      }
    });
      console.log('BasketItem Response Status:', basketItemRes.status());
      const basketItemJson = await basketItemRes.json();
      console.log('BasketItem Response Body:', basketItemJson);
      console.log("Auth token being sent:", token);

      

      // 🧪 Diagnostic block: Get user info and extract basketId
      const whoamiRes = await request.get('/rest/user/whoami', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

      console.log("Sent headers to /whoami");

      if (!whoamiRes.ok()) {
          throw new Error(`whoami endpoint failed with status ${whoamiRes.status()}`);
      }

      const body = await whoamiRes.json();
      console.log('whoami response JSON:', body);

      const basketId = body?.data?.basket?.id;

    // ✅ GET basketId (now created)

      const basketRes = await api.get(`/rest/basket/${userId}`);
      const basketJson = await basketRes.json();
     

    // Create address
    const addressRes = await api.post('/api/Addresss', {
      data: {
        fullName: 'Jim Juice',
        mobileNum: '1234567890',
        zipCode: '12345',
        streetAddress: '1 Infinite Loop',
        city: 'Juiceville',
        state: 'CA',
        country: 'US'
      }
    });
    const addressJson = await addressRes.json();
    addressId = addressJson.data.id;

    // Add payment
    const paymentRes = await api.post('/api/Cards', {
      data: {
        fullName: 'Jim Juice',
        cardNum: '4111111111111111',
        expMonth: '12',
        expYear: '2099'
      }
    });
    const paymentJson = await paymentRes.json();
    paymentId = paymentJson.data.id;
  });

  test('User can place an order via API', async () => {
    const orderRes = await api.post('/api/Orders', {
      data: {
        basketId,
        addressId,
        deliveryMethodId: 1, // default delivery method
        paymentId
     }
    });

    expect(orderRes.status()).toBe(200);
    const orderJson = await orderRes.json();
    console.log('Order Confirmation:', orderJson);
  });

  test('User can view their own orders', async () => {
    const res = await api.get(`/api/Orders/byUser/${userId}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    console.log('User Orders:', body);
  });
});

