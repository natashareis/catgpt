# Contact Form Setup Guide

## Overview
The contact form has been fully implemented with:
- ✅ Bilingual support (English/French)
- ✅ Form validation (required fields, email format)
- ✅ Modal popup (appears at bottom of screen)
- ✅ Success/Error messages
- ✅ Backend email sending via Flask
- ✅ SOLID principles (modular, separated concerns)

## Client-Side Files Created/Updated

### New Components
- `src/components/ContactModal.js` - Modal form component with validation
- `src/components/ContactModal.css` - Modal styling
- `src/utils/formValidation.js` - Email and field validation utilities

### Updated Files
- `src/index.js` - Added i18n initialization
- `src/App.js` - Added ContactModal state and integration
- `src/App.css` - Updated footer with flexbox layout
- `src/locales/en.json` - Added contact form translations
- `src/locales/fr.json` - Added contact form translations (French)

## Server-Side Setup

### 1. Update Requirements (Already Done)
Added `Flask-Mail` to `server/requirements.txt`

Install it:
```bash
cd server
pip install -r requirements.txt
```

### 2. Configure Email in `.env` File

The contact form needs email credentials to send messages. Choose one option:

#### Option A: Gmail (Recommended for testing)
```env
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
```

**Steps to set up Gmail:**
1. Go to https://myaccount.google.com/
2. Click "Security" in the left menu
3. Enable "2-Step Verification"
4. Go back to Security, find "App passwords"
5. Create a new "App password" for Mail on Windows
6. Use this 16-character password in `.env` as `MAIL_PASSWORD`

#### Option B: Other Email Services
You can use any SMTP service (SendGrid, Mailgun, etc.)

### 3. Test Locally
```bash
# Terminal 1: Run Flask backend
cd server
python app.py

# Terminal 2: Run React client
cd client
npm start
```

Click "Contact Us" in the footer → Fill the form → Submit

## Features

### Frontend Form Validation
- **Name:** Required (minimum 1 character)
- **Email:** Required + valid email format check
- **Message:** Required (minimum 1 character)
- Real-time error clearing as user types

### Success/Error Messages
- **Success:** "Message Sent! Thank you for reaching out. We'll get back to you soon!"
- **Error:** "Oops! Something went wrong. Please try again."
- Modal auto-closes after 3 seconds on success

### Bilingual Support
- Toggle language with 🇨🇦 flag button (bottom right)
- All form labels, placeholders, and messages are translated
- Validation errors appear in the selected language

## Backend Email Route

### Endpoint
```
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

### Response
```json
{
  "success": true,
  "message": "Thank you for your message!"
}
```

### Error Handling
- Missing fields → 400 error
- Invalid email format → 400 error
- Email sending fails → 500 error with "Failed to send message"
- If email not configured, logs to console instead

## Production Deployment

When deploying to Vercel (client) and Render/Heroku (server):

1. **Set environment variables in server hosting:**
   - Add `MAIL_USERNAME`, `MAIL_PASSWORD`, etc. to your platform's env variables

2. **Update client API URL:**
   - In React, change `process.env.REACT_APP_API_URL` to your live server URL

3. **Email Service:**
   - For production, consider using SendGrid or Mailgun for better reliability
   - They have free tiers for small volumes

## Architecture (SOLID Principles)

### Separation of Concerns
- `ContactModal.js` - Handles UI and user interaction
- `formValidation.js` - Pure validation logic (reusable)
- `App.js` - Modal state management
- Flask `/contact` endpoint - Email handling

### Single Responsibility
- Each component does one thing well
- Validation logic is independent of UI
- Email sending is isolated in backend

### No Tight Coupling
- Modal can be used anywhere in the app
- Validation utilities are framework-agnostic
- Backend email logic is independent

## Troubleshooting

### Email not sending?
1. Check that `.env` has valid SMTP credentials
2. For Gmail: Ensure "App password" is used (not regular password)
3. Check server logs for error messages
4. Verify MAIL_USE_TLS is set correctly for your email provider

### Modal not appearing?
1. Check browser console for errors
2. Ensure LanguageProvider wraps App in `index.js`
3. Verify ContactModal import in App.js

### Validation errors in wrong language?
1. Ensure language toggle is working (bottom right corner)
2. Check that translation keys in `formValidation.js` match keys in `.json` files

## Next Steps

1. **Configure email** in `.env` file
2. **Test locally** with the form
3. **Deploy** to your production servers
4. **Monitor** email delivery and form submissions
