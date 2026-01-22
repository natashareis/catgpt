/**
 * E2E Tests for Chat Page
 * Tests chat functionality, language toggle, and loading states.
 */

import { test, expect } from '@playwright/test';

test.describe('Chat Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display chat interface', async ({ page }) => {
    await expect(page.getByTestId('chat-container')).toBeVisible();
    await expect(page.getByTestId('chat-title')).toBeVisible();
    await expect(page.getByTestId('morgana-image')).toBeVisible();
  });

  test('should have functional chat input', async ({ page }) => {
    const input = page.getByTestId('chat-input');
    const sendButton = page.getByTestId('chat-send-button');
    
    await expect(input).toBeVisible();
    await expect(sendButton).toBeVisible();
    await expect(sendButton).toBeEnabled();
  });

  test('should type message in chat input', async ({ page }) => {
    const input = page.getByTestId('chat-input');
    await input.fill('Hello Morgana');
    await expect(input).toHaveValue('Hello Morgana');
  });

  test('should open language dropdown and select language', async ({ page }) => {
    const langToggle = page.getByTestId('language-toggle-button');
    await expect(langToggle).toBeVisible();
    await expect(langToggle).toContainText('CA-EN');
    
    // Click to open dropdown
    await langToggle.click();
    
    // Verify dropdown is visible
    const dropdown = page.getByTestId('language-dropdown');
    await expect(dropdown).toBeVisible();
    
    // Verify all language options are present
    await expect(page.getByTestId('language-option-en')).toBeVisible();
    await expect(page.getByTestId('language-option-fr')).toBeVisible();
    await expect(page.getByTestId('language-option-pt')).toBeVisible();
    
    // Select French
    await page.getByTestId('language-option-fr').click();
    
    // Verify button shows CA-FR
    await expect(langToggle).toContainText('CA-FR');
    
    // Verify dropdown is closed
    await expect(dropdown).not.toBeVisible();
  });

  test('should have disclaimer visible', async ({ page }) => {
    const disclaimer = page.getByTestId('chat-disclaimer');
    await expect(disclaimer).toBeVisible();
    await expect(disclaimer).toContainText('v1.2');
  });

  test('should have empty chat history initially', async ({ page }) => {
    const chatHistory = page.getByTestId('chat-history');
    await expect(chatHistory).toBeVisible();
    
    const messages = await chatHistory.locator('[data-testid^="message-"]').count();
    expect(messages).toBe(0);
  });
});
