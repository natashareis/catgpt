/**
 * E2E Tests for About Page
 * Tests developer information and LinkedIn link.
 */

import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should display about page', async ({ page }) => {
    await expect(page.getByTestId('about-container')).toBeVisible();
    await expect(page.getByTestId('about-name')).toBeVisible();
  });

  test('should show developer photo', async ({ page }) => {
    const photo = page.getByTestId('about-photo');
    await expect(photo).toBeVisible();
  });

  test('should display bio sections', async ({ page }) => {
    await expect(page.getByTestId('about-passion')).toBeVisible();
    await expect(page.getByTestId('about-bio')).toBeVisible();
    await expect(page.getByTestId('about-personal')).toBeVisible();
  });

  test('should display tech stack', async ({ page }) => {
    const techStack = page.getByTestId('tech-stack');
    await expect(techStack).toBeVisible();
    
    const badges = await techStack.locator('[data-testid^="tech-badge-"]').count();
    expect(badges).toBeGreaterThan(0);
  });

  test('should have LinkedIn button', async ({ page }) => {
    const linkedinButton = page.getByTestId('linkedin-button');
    await expect(linkedinButton).toBeVisible();
    await expect(linkedinButton).toHaveAttribute('href', /linkedin\.com/);
    await expect(linkedinButton).toHaveAttribute('target', '_blank');
  });

  test('should display section headings', async ({ page }) => {
    await expect(page.getByTestId('about-who-heading')).toBeVisible();
    await expect(page.getByTestId('about-build-heading')).toBeVisible();
  });
});
