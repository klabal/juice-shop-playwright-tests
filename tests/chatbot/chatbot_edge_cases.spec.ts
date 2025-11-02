import { test, expect } from '@playwright/test';
import {
  login,
  openChatbot,
  sendPromptAndGetReply,
  closeWelcomeBannerIfVisible,
} from './chatbot_helpers';

test.describe('Chatbot Battle Gauntlet™', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await login(page, 'admin@juice-sh.op', 'admin123');
    await closeWelcomeBannerIfVisible(page);
    await openChatbot(page);
  });

  test('XSS Injection is dangerously echoed back (expected vulnerability)', async ({ page }) => {
  const xssPayload = `<img src=x onerror=alert("XSS")>`;
  const reply = await sendPromptAndGetReply(page, xssPayload, { delayTyping: true });

  console.warn('Chatbot reply (XSS vulnerable):', reply);
  if (reply.includes('<img') && reply.includes('onerror')) {
    // XSS successfully echoed back (vulnerable, expected)
    expect(reply).toContain('<img');
    expect(reply).toContain('onerror');
  } else {
    // Either sanitized or filtered
    console.log('🔒 Chatbot may have filtered input (not vulnerable)');
    expect(reply).toContain('Sorry I couldn\'t understand'); // Soft check
  }

 // expect(reply).toContain('<img');     // Confirm unescaped input
  //expect(reply).toContain('onerror');  // Confirm dangerous attribute
});


  test('Spam coupon requests to observe bot response', async ({ page }) => {
  const prompts = Array(10).fill('Do you have any coupons?');

  for (const prompt of prompts) {
    const reply = await sendPromptAndGetReply(page, prompt, { delayTyping: true });
    expect(reply).toBeDefined();
    expect(reply.length).toBeGreaterThan(0);
  }
});

 test('Handles broken input and emoji spam without crash', async ({ page }) => {
    const weirdInput = `/\\/\\/\\/\\/\\/\\/\\/\\/\\ 🔥🦑👻💥🤸‍♂️🫀🕷️🪦🧄🫧💅💅💅💅💅💅💅💅💅💅💅💅💅`;
    const reply = await sendPromptAndGetReply(page, weirdInput, { delayTyping: true });

    expect(reply).toBeDefined();
    expect(reply.length).toBeGreaterThan(0);
    expect(reply.toLowerCase()).not.toContain('error');
    expect(reply.toLowerCase()).not.toContain('crash');
  });

test('Chat history does NOT persist after reload', async ({ page }) => {
  // Step 1: Go to contact page and open the chatbot
  await page.goto('http://localhost:3000/#/chatbot');
  //await openChatBot(page);
  await closeWelcomeBannerIfVisible(page);

  // Step 2: Send a message
  const testMessage = 'Vanishing act check';
  const inputLocator = page.getByRole('textbox', {
    name: 'Text field for a chat message'
  });

  await inputLocator.fill(testMessage);
  await inputLocator.press('Enter');

  // Step 3: Confirm it appears before reload
  const chatWindow = page.locator('#chat-window');
  await expect(chatWindow).toContainText(testMessage);
  

  // Step 4: Reload page
  await page.reload();

 

  // Step 5: Reopen chatbot
 // await openChatBot(page);
  await page.goto('http://localhost:3000/#/chatbot');
  await closeWelcomeBannerIfVisible(page);
   const localData = await page.evaluate(() => {
  return JSON.stringify(localStorage);
});
console.log('Local Storage:', localData);

const cookies = await page.context().cookies();
console.log('Cookies:', cookies);

const sessionData = await page.evaluate(() => {
  return JSON.stringify(sessionStorage);
});
console.log('Session Storage:', sessionData);



  // Step 6: Confirm previous message is NOT present
  await expect(chatWindow).not.toContainText(testMessage);
});

//test('Inspect storage before and after reload', async ({ page }) => {
 
 // await page.goto('http://localhost:3000/#/chatbot'); // adjust if needed
 // await closeWelcomeBannerIfVisible(page);
  //await page.getByPlaceholder('Enter your name').fill('Test');
  //await page.getByRole('button', { name: 'Start Chat' }).click();

  // Wait for name to appear or chat to initialize
 // await expect(page.locator('#chat-window')).toContainText('Test');

  // BEFORE RELOAD: capture local/session storage & cookies
 // const beforeLocal = await page.evaluate(() => JSON.stringify(localStorage));
 // const beforeSession = await page.evaluate(() => JSON.stringify(sessionStorage));
 // const beforeCookies = await page.context().cookies();

 // console.log('BEFORE RELOAD — Local Storage:', beforeLocal);
 // console.log('BEFORE RELOAD — Session Storage:', beforeSession);
  //console.log('BEFORE RELOAD — Cookies:', beforeCookies);

  //  Trigger a full page reload
 // await page.reload();

  // AFTER RELOAD: recapture everything
  //const afterLocal = await page.evaluate(() => JSON.stringify(localStorage));
  //const afterSession = await page.evaluate(() => JSON.stringify(sessionStorage));
 // const afterCookies = await page.context().cookies();

 // console.log('AFTER RELOAD — Local Storage:', afterLocal);
 // console.log('AFTER RELOAD — Session Storage:', afterSession);
  //console.log('AFTER RELOAD — Cookies:', afterCookies);

  // Optional: see if name still exists on screen
 // await expect(page.locator('#chat-window')).toContainText('ugyyt');
//});

test.describe('Known Vulnerabilities Suite', () => {
  test('XSS Echoed (known issue)', async ({ page }) => {
    const xssPayload = `<img src=x onerror=alert("XSS")>`;
    const reply = await sendPromptAndGetReply(page, xssPayload, { delayTyping: true });

    expect(reply).toContain('<img');
    expect(reply).toContain('onerror');

    console.log('App is vulnerable to XSS. Payload echoed:', reply);
  });
});



});
