import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import App from './App';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        {component}
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('App', () => {
  test('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(document.querySelector('.App')).toBeInTheDocument();
  });

  test('renders navbar', () => {
    renderWithProviders(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders footer', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/GatosGPT/i)).toBeInTheDocument();
  });

  test('has theme toggle', () => {
    renderWithProviders(<App />);
    const themeButton = screen.getByLabelText(/toggle theme/i);
    expect(themeButton).toBeInTheDocument();
  });
});
