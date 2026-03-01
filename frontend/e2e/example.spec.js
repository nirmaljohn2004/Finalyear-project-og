import { test, expect } from '@playwright/test';

test('homepage has expected title', async ({ page }) => {
    await page.goto('/');

    // Assuming the app has a title, adjust the expected title to your app's title
    await expect(page).toHaveTitle(/EvoCode|Vite \+ React/i);
});
