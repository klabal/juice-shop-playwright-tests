import { test, expect } from '@playwright/test';
import {
  chatbotSelector,
  openChatbot,
  sendPromptAndGetReply,
  closeWelcomeBannerIfVisible,
  spamPrompts,
  login
} from './chatbot_helpers';

test('Chatbot Stress Test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await login(page, 'admin@juice-sh.op', 'admin123');
  await closeWelcomeBannerIfVisible(page);
  await openChatbot(page);
 // Run all spam prompts (this includes input + reply handling)
const results = await spamPrompts(page, [
  'Do you have any coupons?',
  'I am admin.',
  'Bob’s sweet',
  '🔥😂🧄🫠 give me a deal',
  '<script>alert("xss")</script>',
  'Can I hack you?',
  'asdfkajshdfklasdjf'
], {
  delayTyping: true,
  screenshotDir: 'test-results/chatbot/screenshots',
  logToFile: 'test-results/chatbot/chatlog.json'
});
for (const { prompt, reply } of results) {
  console.log(`🧃 "${prompt}" → 🤖 "${reply}"`);
  expect(reply.length).toBeGreaterThan(0);
}
 
});
