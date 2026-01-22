import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateContactForm } from '../utils/formValidation';
import './ContactModal.css';

function ContactModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const { isValid, errors: validationErrors } = validateContactForm(formData);
    
    if (!isValid) {
      // Convert error keys to translated messages
      const translatedErrors = {};
      Object.keys(validationErrors).forEach(key => {
        translatedErrors[key] = t(validationErrors[key]);
      });
      setErrors(translatedErrors);
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setErrors({});
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          onClose();
          setStatus(null);
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="contact-modal-overlay" onClick={onClose} data-testid="contact-modal-overlay">
      <div className="contact-modal" onClick={e => e.stopPropagation()} data-testid="contact-modal">
        <div className="contact-modal-header">
          <h2 data-testid="contact-modal-title">{t('contactModal.title')}</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal" data-testid="contact-modal-close">×</button>
        </div>

        <div className="contact-modal-email">
          <p data-testid="contact-modal-email-to">{t('contactModal.emailTo')} <strong>support@catsgpt.ca</strong></p>
        </div>

        <p className="contact-modal-description" data-testid="contact-modal-description">{t('contactModal.description')}</p>

        {status === 'success' && (
          <div className="status-message success" data-testid="contact-status-success">
            <strong>{t('contactModal.successTitle')}</strong>
            <p>{t('contactModal.successMessage')}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="status-message error" data-testid="contact-status-error">
            <strong>{t('contactModal.errorTitle')}</strong>
            <p>{t('contactModal.errorMessage')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form" data-testid="contact-form">
          <div className="form-group">
            <label htmlFor="name">{t('contactModal.name')}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={t('contactModal.namePlaceholder')}
              disabled={isLoading}
              data-testid="contact-input-name"
            />
            {errors.name && <span className="error-text" data-testid="contact-error-name">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('contactModal.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('contactModal.emailPlaceholder')}
              disabled={isLoading}
              data-testid="contact-input-email"
            />
            {errors.email && <span className="error-text" data-testid="contact-error-email">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message">{t('contactModal.message')}</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t('contactModal.messagePlaceholder')}
              rows="5"
              disabled={isLoading}
              data-testid="contact-input-message"
            />
            {errors.message && <span className="error-text" data-testid="contact-error-message">{errors.message}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading} data-testid="contact-btn-cancel">
              {t('contactModal.cancel')}
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading} data-testid="contact-btn-submit">
              {isLoading ? t('contactModal.sending') : t('contactModal.send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
