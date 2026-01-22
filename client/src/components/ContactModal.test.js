import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider } from './contexts/LanguageContext';
import ContactModal from './components/ContactModal';

// Mock fetch
global.fetch = jest.fn();

const renderWithProvider = (component) => {
  return render(
    <LanguageProvider>
      {component}
    </LanguageProvider>
  );
};

describe('ContactModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
    mockOnClose.mockClear();
  });

  test('renders when isOpen is true', () => {
    renderWithProvider(<ContactModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByTestId('contact-modal')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    renderWithProvider(<ContactModal isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByTestId('contact-modal')).not.toBeInTheDocument();
  });

  test('renders all form fields', () => {
    renderWithProvider(<ContactModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByTestId('contact-name')).toBeInTheDocument();
    expect(screen.getByTestId('contact-email')).toBeInTheDocument();
    expect(screen.getByTestId('contact-message')).toBeInTheDocument();
  });

  test('renders send button', () => {
    renderWithProvider(<ContactModal isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByTestId('contact-send')).toBeInTheDocument();
  });

  test('renders close button', () => {
    renderWithProvider(<ContactModal isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText(/close/i);
    expect(closeButton).toBeInTheDocument();
  });

  test('calls onClose when close button clicked', () => {
    renderWithProvider(<ContactModal isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('updates form fields on input', () => {
    renderWithProvider(<ContactModal isOpen={true} onClose={mockOnClose} />);
    
    const nameInput = screen.getByTestId('contact-name');
    const emailInput = screen.getByTestId('contact-email');
    const messageInput = screen.getByTestId('contact-message');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hello!' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(messageInput.value).toBe('Hello!');
  });

  test('validates email format', async () => {
    renderWithProvider(<ContactModal isOpen={true} onClose={mockOnClose} />);
    
    const emailInput = screen.getByTestId('contact-email');
    const sendButton = screen.getByTestId('contact-send');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  test('shows error when fields are empty', async () => {
    renderWithProvider(<ContactModal isOpen={true} onClose={mockOnClose} />);
    
    const sendButton = screen.getByTestId('contact-send');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' })
    });

    renderWithProvider(<ContactModal isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.change(screen.getByTestId('contact-name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('contact-email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('contact-message'), { target: { value: 'Test message' } });
    
    fireEvent.click(screen.getByTestId('contact-send'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/contact'),
        expect.objectContaining({
          method: 'POST'
        })
      );
    });
  });
});
