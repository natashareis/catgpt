import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import axios from 'axios';
import morganaImage from './Morgana.jpg';
import Modal from './components/Modal';

function Chat() {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    const randomLoadingText = Math.random() > 0.5 ? t('chat.purring') : t('chat.makingBiscuits');
    setLoadingText(randomLoadingText);
    
    setMessage('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/chat`, {
        message: message,
        language: i18n.language,
      });

      // Check if usage limit exceeded
      if (response.status === 429 || response.data.error === 'usage_limit_exceeded') {
        setShowUsageLimitModal(true);
        return;
      }

      const botMessage = { role: 'bot', text: response.data.reply };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Check if it's a usage limit error (429 status)
      if (error.response?.status === 429 || error.response?.data?.error === 'usage_limit_exceeded') {
        setShowUsageLimitModal(true);
      } else {
        const errorMessage = { 
          role: 'bot', 
          text: t('chat.error')
        };
        setChatHistory(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Chat" data-testid="chat-container">
      <Modal
        isOpen={showUsageLimitModal}
        onClose={() => setShowUsageLimitModal(false)}
        title={t('usageLimit.title')}
        message={t('usageLimit.message')}
        subtitle={t('usageLimit.subtitle')}
        buttonText={t('usageLimit.ok')}
      />
      <header className="chat-header" data-testid="chat-header">
        <div className="morgana-container">
          <img src={morganaImage} className="morgana-image" alt="Morgana the cat" data-testid="morgana-image" />
        </div>
        <div className="chat-title-section">
          <h1 data-testid="chat-title">{t('chat.title')}</h1>
          {
            (() => {
              const raw = t('chat.subtitle');
              const parts = raw.split(' - ');
              const first = parts.shift();
              const rest = parts.length ? parts.join(' - ') : '';
              return (
                <p className="chat-subtitle" data-testid="chat-subtitle">
                  <strong>{first}</strong>
                  {rest && (
                    <>
                      <br />
                      <span>{rest}</span>
                    </>
                  )}
                </p>
              );
            })()
          }
          <p className="chat-disclaimer" data-testid="chat-disclaimer">{t('chat.disclaimer')}</p>
        </div>
      </header>
      <div className="chat-window" data-testid="chat-window">
        <div className="chat-history" data-testid="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`} data-testid={`message-${msg.role}-${index}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="message bot" data-testid="loading-indicator">
              <p><i>{loadingText}</i></p>
            </div>
          )}
        </div>
        <form className="chat-input" onSubmit={sendMessage} data-testid="chat-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('chat.placeholder')}
            disabled={isLoading}
            data-testid="chat-input"
          />
          <button type="submit" disabled={isLoading} data-testid="chat-send-button">
            {isLoading ? t('chat.sending') : t('chat.send')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
