import { Locator, Page, expect } from '@playwright/test';
import fs from 'fs/promises';

export const chatbotSelector = {
  openButton: 'button[aria-label="Open Sidenav"]',
  input: 'textbox[aria-label="Text field for a chat message"]',
  messages: '.message-container.ng-star-inserted'
};

export async function openChatbot(page: Page): Promise<void> {
  await page.click(chatbotSelector.openButton);
  await page.getByRole('link', { name: 'Go to chatbot page' }).click();
  await page.getByRole('textbox', { name: 'Text field for a chat message' }).click();
  //await expect(page.locator(chatbotSelector.input)).toBeVisible();
}

export async function login(page: Page, username: string, password: string): Promise<void> {
  await page.goto('/#/login');
  await page.fill('#email', username);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/#/search'); // or home route after login
}

export async function sendPromptAndGetReply(
  page: Page,
  prompt: string,
  opts: { delayTyping?: boolean } = {}
): Promise<string> {
  const inputLocator = page.getByRole('textbox', { name: 'Text field for a chat message' });

  if (opts.delayTyping) {
    for (const char of prompt) {
      await inputLocator.type(char);
      await page.waitForTimeout(50);
    }
  } else {
    await inputLocator.fill(prompt);
  }

  await inputLocator.press('Enter');

  const lastReplyLocator = page.locator('.message-container.ng-star-inserted').last();
  await expect(lastReplyLocator).toBeVisible({ timeout: 5000 });

  return await lastReplyLocator.textContent() ?? '';
}
type SpamPromptOptions = {
  delayTyping?: boolean;
  screenshotDir?: string;
  logToFile?: string;
};

export async function spamPrompts(page: Page, prompts: string[], opts: SpamPromptOptions = {}) {
  const results: { prompt: string; reply: string }[] = [];

  const input = await page.locator('input[aria-label="Text field for a chat message"]'); // just once
  await input.click(); // focus

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    console.log(`📤 Sending prompt: ${prompt}`);

const reply = await sendPromptAndGetReply(page, prompt, {
  delayTyping: opts.delayTyping,
});


    if (opts.screenshotDir) {
      await page.screenshot({
        path: `${opts.screenshotDir}/chatbot-${i + 1}.png`,
        fullPage: true
      });
    }

    if (opts.logToFile) {
      const previous = await fs.readFile(opts.logToFile).catch(() => '[]');
      const log = JSON.parse(previous.toString());
      log.push({ prompt, reply });
      await fs.writeFile(opts.logToFile, JSON.stringify(log, null, 2));
    }

    results.push({ prompt, reply });
  }

  return results;
}

export async function closeWelcomeBannerIfVisible(page: Page): Promise<void> {
  const closeBtn = page.locator('button[aria-label="Close Welcome Banner"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }
}
