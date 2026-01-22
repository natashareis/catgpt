import React from 'react';

function Modal({ isOpen, onClose, title, message, subtitle, buttonText }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" data-testid="modal-overlay">
      <div className="modal-content" data-testid="modal-content">
        <h2 data-testid="modal-title">{title}</h2>
        {subtitle && <p className="modal-subtitle" data-testid="modal-subtitle">{subtitle}</p>}
        <p className="modal-message" data-testid="modal-message">{message}</p>
        <button onClick={onClose} className="modal-button" data-testid="modal-button">
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default Modal;
