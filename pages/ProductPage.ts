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
            // Force open the search bar by clicking the parent (if mat-icon is inside a button or div)
            await this.page.getByText('search').click();
           // await this.page.pause(); // Debugging pause
            await this.page.locator('#mat-input-1').click();
            await this.page.locator('#mat-input-1').fill(term);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(500); // Let results load
            
        }
        catch(e){
            console.error('Search bar interaction failed:', e);
            await this.page.screenshot({ path: 'search-error.png' });
            throw e;
        }
    }
}