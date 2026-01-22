import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Chat from './Chat';

// Mock fetch
global.fetch = jest.fn();

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        {component}
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('Chat', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders chat interface', () => {
    renderWithProviders(<Chat />);
    expect(screen.getByTestId('chat-container')).toBeInTheDocument();
  });

  test('renders chat input', () => {
    renderWithProviders(<Chat />);
    const input = screen.getByTestId('chat-input');
    expect(input).toBeInTheDocument();
    expect(input.placeholder).toBeTruthy();
  });

  test('renders send button', () => {
    renderWithProviders(<Chat />);
    expect(screen.getByTestId('send-button')).toBeInTheDocument();
  });

  test('input updates on typing', () => {
    renderWithProviders(<Chat />);
    const input = screen.getByTestId('chat-input');
    fireEvent.change(input, { target: { value: 'Hello cat!' } });
    expect(input.value).toBe('Hello cat!');
  });

  test('send button disabled when input empty', () => {
    renderWithProviders(<Chat />);
    const sendButton = screen.getByTestId('send-button');
    expect(sendButton).toBeDisabled();
  });

  test('send button enabled when input has text', () => {
    renderWithProviders(<Chat />);
    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    expect(sendButton).not.toBeDisabled();
  });

  test('displays disclaimer', () => {
    renderWithProviders(<Chat />);
    expect(screen.getByTestId('chat-disclaimer')).toBeInTheDocument();
  });

  test('chat history starts empty', () => {
    renderWithProviders(<Chat />);
    const messages = screen.queryAllByTestId(/chat-message/);
    expect(messages.length).toBe(0);
  });

  test('handles send message', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'Meow!' })
    });

    renderWithProviders(<Chat />);
    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  test('displays loading state when sending', async () => {
    fetch.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    renderWithProviders(<Chat />);
    const input = screen.getByTestId('chat-input');
    const sendButton = screen.getByTestId('send-button');

    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
    });
  });
});
