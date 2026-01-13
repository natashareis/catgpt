import React, { useState } from 'react';
import axios from 'axios';
import morganaImage from './Morgana.jpg';

function Chat() {
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
      const response = await axios.post('http://localhost:5000/chat', {
        message: message,
      });

      const botMessage = { role: 'bot', text: response.data.reply };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'bot', 
        text: 'Sorry, something went wrong. Please check the console and make sure the server is running.' 
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
          <h1>CatGPT</h1>
          <p>Your affectionate and wise feline companion</p>
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
            placeholder="Ask the cat a question..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
