import { test, expect } from '@playwright/test';

test('app loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Wait for React app to mount
  await page.waitForSelector('#root');
  
  // Check that the root element has content
  const rootContent = await page.locator('#root').innerHTML();
  expect(rootContent.length).toBeGreaterThan(0);
});

test('has title', async ({ page }) => {
  await page.goto('/');
  
  // Check page title
  await expect(page).toHaveTitle(/GaveØnske/);
});
