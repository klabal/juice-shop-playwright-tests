import { test, expect, request as globalRequest, APIRequestContext } from '@playwright/test';

const userCredentials = {
  email: 'some-user@juice-sh.op',
  password: 'password123'
};

let api: APIRequestContext;
let token: string;
let userId: number;

test.describe('🛒 Juice Shop Checkout API Tests (Real Flow)', () => {
  test.beforeAll(async () => {
    const baseURL = 'http://localhost:3000'; // or your dev server URL

    // Step 1: Unauthenticated login context
    const context = await globalRequest.newContext({
      baseURL
    });

    // 🔐 LOGIN
    const loginRes = await context.post('http://localhost:3000/rest/user/login', {
      data: userCredentials
    });

    const loginJson = await loginRes.json();
    token = loginJson.authentication.token;
    userId = loginJson.authentication.uid;


    // Authenticated context
    api = await globalRequest.newContext({
      extraHTTPHeaders: {
        Authorization: token
      }

    });

  });
  test('🧪 API login & whoami works correctly', async ({ }) => {
      const whoami = await api.get('/rest/user/whoami');
      const whoamiJson = await whoami.json();

      console.log('✅ Sanity Check: Logged in as', whoamiJson.user?.email);

      expect(whoami.status()).toBe(200);
      expect(whoamiJson.user?.email).toContain('@juice-sh.op');
    });
});
