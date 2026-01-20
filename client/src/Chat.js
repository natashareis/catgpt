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

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
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
    <div className="Chat">
      <Modal
        isOpen={showUsageLimitModal}
        onClose={() => setShowUsageLimitModal(false)}
        title={t('usageLimit.title')}
        message={t('usageLimit.message')}
        subtitle={t('usageLimit.subtitle')}
        buttonText={t('usageLimit.ok')}
      />
      <header className="chat-header">
        <div className="morgana-container">
          <img src={morganaImage} className="morgana-image" alt="Morgana the cat" />
        </div>
        <div className="chat-title-section">
          <h1>{t('chat.title')}</h1>
          <p>{t('chat.subtitle')}</p>
          <p className="chat-disclaimer">{t('chat.disclaimer')}</p>
        </div>
      </header>
      <div className="chat-window">
        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <p><i>{t('chat.purring')}</i></p>
            </div>
          )}
        </div>
        <form className="chat-input" onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('chat.placeholder')}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? t('chat.sending') : t('chat.send')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
