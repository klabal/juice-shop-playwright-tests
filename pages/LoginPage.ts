// pages/LoginPage.ts
import { Page } from '@playwright/test';
export class LoginPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/#/login');
    }
    async login(username: string, password: string) {

        await this.page.fill('input#email', username);
        await this.page.fill('input#password', password);
        await this.page.getByRole('button', { name: 'Close Welcome Banner' }).click();
        await this.page.click('button#loginButton');
        await this.page.waitForLoadState('networkidle');
    }
}