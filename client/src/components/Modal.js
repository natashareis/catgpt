import React from 'react';

function Modal({ isOpen, onClose, title, message, subtitle, buttonText }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        {subtitle && <p className="modal-subtitle">{subtitle}</p>}
        <p className="modal-message">{message}</p>
        <button onClick={onClose} className="modal-button">
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default Modal;
