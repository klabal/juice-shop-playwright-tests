import { test, expect, request as baseRequest} from '@playwright/test';
import { xssTestData } from '../utils/testData.ts';


let token: string;

test.describe('Juice Shop API Tests', () => {
  test.beforeAll(async () => {
    const context = await baseRequest.newContext();
    const res = await context.post('http://localhost:3000/rest/user/login', {
      data: {
        email: 'admin@juice-sh.op',
        password: 'admin123'
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    token = body.authentication.token;

    expect(token).toBeTruthy();
  });

  test(' Should get product list', async ({ request }) => {
    const res = await request.get('http://localhost:3000/api/Products');
    expect(res.status()).toBe(200);

    const products = await res.json();
    console.log(`Found ${products.data.length} products 🧃`);
    expect(products.data.length).toBeGreaterThan(0);
  });

  test(' Should access basket with auth token', async ({ request }) => {
    const res = await request.get('http://localhost:3000/rest/basket/1', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expect(res.status()).toBe(200);
    const basket = await res.json();
    expect(basket).toHaveProperty('data');
  });

  test('Should try to inject SQL into search query', async ({ request }) => {
    const res = await request.get('http://localhost:3000/rest/products/search?q=\' OR 1=1 --');
    // Expecting either success or failure due to injection
    expect([200, 500]).toContain(res.status());

    const result = await res.json().catch(() => ({ error: 'Invalid JSON (500 error)' }));
    console.log('SQL Injection Attempt Result:', result)
  });
  for (let i = 0; i < 5; i++) {
    test(`XSS Payload Attempt #${i + 1}`, async ({ request }) => {
      const captchaRes = await request.get('/rest/captcha');
      const captchaJson = await captchaRes.json();

      const captchaId = captchaJson.captchaId;
      const captchaAnswer = captchaJson.answer;
      const response = await request.post('/api/Feedbacks', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          comment: xssTestData.xssPayloadBasic,
          rating: 1,
          captcha: captchaAnswer,
          captchaId: captchaId
        },
      });
      console.log(xssTestData.xssPayloadBasic);
      try {
        expect(response.status()).toBeLessThan(500);
      } catch (e) {
        console.log('Status:', response.status());
        console.log('Body:', await response.body());
        throw e;
      }
    });
  }
  test('Stored XSS vulnerability check', async ({ request }) => {
    // Step 1: Solve CAPTCHA
    const captchaRes = await request.get('http://localhost:3000/rest/captcha/');
    const { captchaId, answer } = await captchaRes.json();

    const payload = 'Stored test: <script>alert("XSS")</script>';

    // Step 2: Submit Feedback with payload
    const postResponse = await request.post('http://localhost:3000/api/Feedbacks', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: {
        comment: payload,
        rating: 5,
        captcha: answer,
        captchaId: captchaId
      }
    });

    console.log('POST status:', postResponse.status());
    const postData = await postResponse.json();
    console.log('POST body:', postData);
    expect(postResponse.ok()).toBeTruthy();

    // Step 3: Retrieve all feedback and search for payload
    const getResponse = await request.get('http://localhost:3000/api/Feedbacks', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const feedbackList = await getResponse.json();
    console.log('Feedback entries:', feedbackList.data);

    const found = feedbackList.data.some((entry: { comment: string }) =>
      entry.comment.includes('Stored test')
    );

    expect(found).toBeTruthy(); // 💥 Confirm XSS payload persisted in DB
  });

});
