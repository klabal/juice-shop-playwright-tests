import { test, expect, request as baseRequest } from '@playwright/test';
import { xssTestData } from '../../utils/testData';
import { loginAsBasicUser } from '../../utils/auth';

const BASE_URL = 'http://localhost:3000';

test.describe('Juice Shop API Tests › Admin Flow', () => {
  let adminToken: string;

  test.beforeAll(async () => {
    const context = await baseRequest.newContext();
    const res = await context.post(`${BASE_URL}/rest/user/login`, {
      data: {
        email: 'admin@juice-sh.op',
        password: 'admin123'
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    adminToken = body.authentication.token;
    expect(adminToken).toBeTruthy();
  });

  test('Get product list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/Products`);
    expect(res.status()).toBe(200);

    const products = await res.json();
    console.log(`Found ${products.data.length} products 🧃`);
    expect(products.data.length).toBeGreaterThan(0);
  });


  test('SQL Injection attempt in search query', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/rest/products/search?q=' OR 1=1 --`);
    expect([200, 500]).toContain(res.status());

    try {
      const result = await res.json();
      console.log('SQL Injection Result:', result);
    } catch {
      console.warn('🔴 SQLi response not JSON-parsable (500 or invalid)');
    }
  });

  for (let i = 0; i < 5; i++) {
    test(`XSS Feedback Attempt #${i + 1}`, async ({ request }) => {
      const captchaRes = await request.get(`${BASE_URL}/rest/captcha`);
      const { captchaId, answer } = await captchaRes.json();

      const res = await request.post(`${BASE_URL}/api/Feedbacks`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        data: {
          comment: xssTestData.xssPayloadBasic,
          rating: 1,
          captcha: answer,
          captchaId
        }
      });

      expect(res.status(), 'XSS attempt failed with server error').toBeLessThan(500);
    });
  }

  test('Stored XSS vulnerability check', async ({ request }) => {
    const captchaRes = await request.get(`${BASE_URL}/rest/captcha`);
    const { captchaId, answer } = await captchaRes.json();

    const payload = 'Stored test: <script>alert("XSS")</script>';

    const postRes = await request.post(`${BASE_URL}/api/Feedbacks`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        comment: payload,
        rating: 5,
        captcha: answer,
        captchaId
      }
    });

    expect(postRes.ok()).toBeTruthy();
    console.log('✅ XSS payload posted');

    const getRes = await request.get(`${BASE_URL}/api/Feedbacks`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    const feedbackList = await getRes.json();
    const found = feedbackList.data.some((entry: { comment: string }) =>
      entry.comment.includes('Stored test')
    );

    expect(found).toBeTruthy();
  });
});

test.describe('User Enumeration Check', () => {
  test('Low-privilege user should not see all user data', async ({ request }) => {
    const token = await loginAsBasicUser(request);
    const res = await request.get(`${BASE_URL}/rest/user/authentication-details`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const users = await res.json();
    expect(Array.isArray(users)).toBe(false);

    if (Array.isArray(users)) {
      throw new Error('🔥 VULNERABILITY: User list exposed to basic user!');
    } else {
      console.log('✅ User list not leaked.');
    }
  });
});

