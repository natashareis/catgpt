import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import About from './About';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        {component}
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('About', () => {
  test('renders about page', () => {
    renderWithProviders(<About />);
    expect(screen.getByTestId('about-container')).toBeInTheDocument();
  });

  test('displays developer photo', () => {
    renderWithProviders(<About />);
    const photo = screen.getByTestId('developer-photo');
    expect(photo).toBeInTheDocument();
    expect(photo.alt).toBeTruthy();
  });

  test('displays bio sections', () => {
    renderWithProviders(<About />);
    expect(screen.getByTestId('about-bio')).toBeInTheDocument();
  });

  test('displays tech stack', () => {
    renderWithProviders(<About />);
    expect(screen.getByTestId('tech-stack')).toBeInTheDocument();
  });

  test('has LinkedIn button', () => {
    renderWithProviders(<About />);
    const linkedInButton = screen.getByTestId('linkedin-button');
    expect(linkedInButton).toBeInTheDocument();
    expect(linkedInButton.href).toContain('linkedin.com');
  });

  test('displays section headings', () => {
    renderWithProviders(<About />);
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });
});
