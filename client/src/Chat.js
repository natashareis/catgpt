import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import morganaImage from './Morgana.jpg';

// Chat component - handles communication with Morgana backend
function Chat() {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setMessage('');

    try {
      // API call to the Flask backend
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/chat`, {
        message: message,
      });

      const botMessage = { role: 'bot', text: response.data.reply };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'bot', 
        text: t('chat.error')
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Chat">
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
              <p><i>purring...</i></p>
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
            {isLoading ? 'Sending...' : t('chat.send')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
