// pages/ProductPage.ts
import { Page } from '@playwright/test';


export class ProductPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }


    async goto() {
        await this.page.goto('/#/search');
    }
   


    async addItemToCartByIndex(index: number) {
       // await this.page.getByRole('button', { name: 'Close Welcome Banner' }).click();
       await this.page.locator('mat-card').filter({ hasText: 'Apple Juice (1000ml)1.99¤Add' }).getByLabel('Add to Basket').click();
      //  await addButtons.nth(index).click();
    }


    async openCart() {
        await this.page.locator('button[aria-label="Show the shopping cart"]').click();
    }
    async closeWelcomeBanner() {
        const bannerButton = this.page.getByRole('button', { name: 'Close Welcome Banner' });
        if (await bannerButton.isVisible()) {
            await bannerButton.click();
        }
    }
    

    async search(term: string) {
        try {
            await this.closeWelcomeBanner();
            const searchInput = this.page.locator('#mat-input-1');
           // await this.page.getByText('search').click();
            await searchInput.waitFor({ state: 'visible' });
            await searchInput.fill(term);
            await searchInput.press('Enter');
            await this.page.waitForTimeout(500); // Let results load
            
        }
        catch(e){
            console.error('Search bar interaction failed:', e);
            await this.page.screenshot({ path: 'search-error.png' });
        }
    }
}