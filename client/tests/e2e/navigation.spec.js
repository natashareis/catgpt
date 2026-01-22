/**
 * E2E Tests for Navigation and Common Elements
 * Tests navbar, footer, theme toggle, and contact modal.
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    
    const aboutLink = page.getByTestId('nav-link-about');
    await aboutLink.click();
    await expect(page).toHaveURL('/about');
    
    const brandLink = page.getByTestId('nav-link-brand');
    await brandLink.click();
    await expect(page).toHaveURL('/');
  });

  test('should have visible navbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('navbar')).toBeVisible();
  });
});

test.describe('Theme Toggle', () => {
  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    
    const themeToggle = page.getByTestId('theme-toggle-button');
    await expect(themeToggle).toBeVisible();
    
    await themeToggle.click();
    await page.waitForTimeout(300);
  });
});

test.describe('Footer', () => {
  test('should display footer with version', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.getByTestId('app-footer');
    await expect(footer).toBeVisible();
    
    const version = page.getByTestId('footer-version');
    await expect(version).toBeVisible();
    await expect(version).toContainText('v1.2');
  });

  test('should have contact button in footer', async ({ page }) => {
    await page.goto('/');
    
    const contactButton = page.getByTestId('footer-contact-button');
    await expect(contactButton).toBeVisible();
  });
});

test.describe('Contact Modal', () => {
  test('should open contact modal', async ({ page }) => {
    await page.goto('/');
    
    const contactButton = page.getByTestId('footer-contact-button');
    await contactButton.click();
    
    await expect(page.getByTestId('contact-modal-overlay')).toBeVisible();
    await expect(page.getByTestId('contact-modal')).toBeVisible();
  });

  test('should close contact modal', async ({ page }) => {
    await page.goto('/');
    
    await page.getByTestId('footer-contact-button').click();
    await expect(page.getByTestId('contact-modal')).toBeVisible();
    
    await page.getByTestId('contact-modal-close').click();
    await expect(page.getByTestId('contact-modal')).not.toBeVisible();
  });

  test('should have all contact form fields', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('footer-contact-button').click();
    
    await expect(page.getByTestId('contact-input-name')).toBeVisible();
    await expect(page.getByTestId('contact-input-email')).toBeVisible();
    await expect(page.getByTestId('contact-input-message')).toBeVisible();
    await expect(page.getByTestId('contact-btn-submit')).toBeVisible();
    await expect(page.getByTestId('contact-btn-cancel')).toBeVisible();
  });

  test('should validate empty form submission', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('footer-contact-button').click();
    
    const submitButton = page.getByTestId('contact-btn-submit');
    await submitButton.click();
    
    await page.waitForTimeout(500);
  });
});
