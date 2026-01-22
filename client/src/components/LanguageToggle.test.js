/**
 * Unit Tests for LanguageToggle Component
 * Tests language dropdown functionality and selection.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageToggle from './LanguageToggle';
import { LanguageProvider } from '../contexts/LanguageContext';

// Mock i18n
jest.mock('../i18n', () => ({
  changeLanguage: jest.fn(),
}));

describe('LanguageToggle', () => {
  const renderWithProvider = () => {
    return render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    );
  };

  test('should render language toggle button with default language CA-EN', () => {
    renderWithProvider();
    const button = screen.getByTestId('language-toggle-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('CA-EN');
  });

  test('should open dropdown when button is clicked', () => {
    renderWithProvider();
    const button = screen.getByTestId('language-toggle-button');
    
    // Dropdown should not be visible initially
    expect(screen.queryByTestId('language-dropdown')).not.toBeInTheDocument();
    
    // Click button to open dropdown
    fireEvent.click(button);
    
    // Dropdown should now be visible
    expect(screen.getByTestId('language-dropdown')).toBeInTheDocument();
  });

  test('should display all three language options', () => {
    renderWithProvider();
    const button = screen.getByTestId('language-toggle-button');
    fireEvent.click(button);
    
    expect(screen.getByTestId('language-option-en')).toBeInTheDocument();
    expect(screen.getByTestId('language-option-fr')).toBeInTheDocument();
    expect(screen.getByTestId('language-option-pt')).toBeInTheDocument();
  });

  test('should show correct labels for each language option', () => {
    renderWithProvider();
    const button = screen.getByTestId('language-toggle-button');
    fireEvent.click(button);
    
    expect(screen.getByText('CA-EN')).toBeInTheDocument();
    expect(screen.getByText('CA-FR')).toBeInTheDocument();
    expect(screen.getByText('BR-PT')).toBeInTheDocument();
    expect(screen.getByText('English (Canada)')).toBeInTheDocument();
    expect(screen.getByText('Français (Canada)')).toBeInTheDocument();
    expect(screen.getByText('Português (Brasil)')).toBeInTheDocument();
  });

  test('should change language when option is selected', () => {
    renderWithProvider();
    const button = screen.getByTestId('language-toggle-button');
    fireEvent.click(button);
    
    // Select French
    const frenchOption = screen.getByTestId('language-option-fr');
    fireEvent.click(frenchOption);
    
    // Button should now show CA-FR
    expect(button).toHaveTextContent('CA-FR');
  });

  test('should close dropdown after selecting a language', () => {
    renderWithProvider();
    const button = screen.getByTestId('language-toggle-button');
    fireEvent.click(button);
    
    const ptOption = screen.getByTestId('language-option-pt');
    fireEvent.click(ptOption);
    
    // Dropdown should be closed
    expect(screen.queryByTestId('language-dropdown')).not.toBeInTheDocument();
  });

  test('should mark currently selected language as active', () => {
    renderWithProvider();
    const button = screen.getByTestId('language-toggle-button');
    fireEvent.click(button);
    
    const enOption = screen.getByTestId('language-option-en');
    expect(enOption).toHaveClass('active');
  });

  test('should close dropdown when clicking outside', () => {
    renderWithProvider();
    const button = screen.getByTestId('language-toggle-button');
    fireEvent.click(button);
    
    expect(screen.getByTestId('language-dropdown')).toBeInTheDocument();
    
    // Simulate click outside
    fireEvent.mouseDown(document.body);
    
    expect(screen.queryByTestId('language-dropdown')).not.toBeInTheDocument();
  });
});
