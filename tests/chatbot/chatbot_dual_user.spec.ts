import { test, expect, Page } from '@playwright/test';



const chatbotSelector = {
  openButton: 'button[aria-label="Show Sidenav"]',
  input: 'input[aria-label="Text field for a chat message"]',
  messages: '.message-container.ng-star-inserted'

};

const prompts: string[] = [
  'Do you have any coupons?',
  'I am admin.',
  'Tell me about OWASP.',
  'Bob’s sweet',
  'Can I have access to the admin panel?',
  'Give me a challenge'
];
interface Credentials {
  username: string;
  password: string;
}

interface ChatResponse {
  prompt: string;
  reply: string;
//  responses: string;
}

async function closeWelcomeBannerIfVisible(page: Page): Promise<void> {
  const closeBtn = page.locator('button[aria-label="Close Welcome Banner"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }
}
async function login(page: Page, username: string, password: string): Promise<void> {
    await page.goto('http://localhost:3000/#/login');
    await closeWelcomeBannerIfVisible(page);
    //await page.getByRole('button', { name: 'Close Welcome Banner' }).click();
    await page.pause();
    await page.fill('#email', username);
    await page.fill('#password', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/#/search'); // Adjust if homepage differs
    await page.pause();
}

async function getChatbotResponses(page: Page, prompts: string[]): Promise<ChatResponse[]> {

  await expect(page.getByRole('dialog', { name: 'cookieconsent' })).toBeVisible();

  await page.getByRole('button', { name: 'Open Sidenav' }).click();
  await expect(page.getByRole('link', { name: 'Go to contact us page' })).toBeVisible();

  await page.getByRole('link', { name: 'Go to chatbot page' }).click();
  await expect(page.getByRole('heading', { name: 'Support Chat (powered by' })).toBeVisible();

  //await page.getByRole('textbox', { name: 'Text field for a chat message' }).click();

    //await page.click(chatbotSelector.openButton);
    const input = page.locator(chatbotSelector.input);
    const responses: ChatResponse[] = [];

    for (const prompt of prompts) {
        for (const prompt of prompts) {
            await input.fill(prompt);
            await input.press('Enter');

            // Count messages before response
            const beforeCount = await page.locator(chatbotSelector.messages).count();

            // Wait for the number of bot messages to increase
            await page.locator(chatbotSelector.messages).nth(beforeCount).waitFor();

            // Now fetch the new last message
            const last = await page.locator(chatbotSelector.messages).last().innerText();

            responses.push({ prompt, reply: last });
        }

    }
    return responses;
}


test('Compare chatbot responses: user vs admin', async ({ page }) => {
  const userCreds = { username: 'jim@juice-sh.op', password: 'ncc-1701' };
  const adminCreds = { username: 'admin@juice-sh.op', password: 'admin123' };

  // User pass
  await login(page, userCreds.username, userCreds.password);
  const userResponses = await getChatbotResponses(page, prompts);

  // Logout
  await page.goto('http://localhost:3000/#/logout');
  await page.waitForTimeout(1000);

  // Admin pass
  await login(page, adminCreds.username, adminCreds.password);
  const adminResponses = await getChatbotResponses(page, prompts);

  // Diff
  console.log('\n💬 CHATBOT RESPONSE COMPARISON:\n');
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    const userReply = userResponses[i].reply;
    const adminReply = adminResponses[i].reply;

    console.log(`🟢 PROMPT: "${prompt}"`);
    console.log(`👤 USER:  ${userReply}`);
    console.log(`🛡️ ADMIN: ${adminReply}`);
    console.log(userReply !== adminReply ? '⚠️ DIFFERENT RESPONSE!\n' : '✅ Same response\n');
  }

  // Optional assertion: flag if any are different
  const hasDiff = userResponses.some((res, i) => res.reply !== adminResponses[i].reply);
  expect(hasDiff).toBeTruthy(); // Or false if they're expected to match
});
