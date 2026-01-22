# CatsGPT 😺

Welcome to CatsGPT, an interactive web application where you can chat with an AI-powered cat persona named Morgana.

This project was built to simulate a conversation with a wise, affectionate, and slightly mischievous cat who will only respond to cat-related topics. The application is powered by the Google Gemini API.

**Live Application:** [https://www.catsgpt.ca/](https://www.catsgpt.ca/)

---

## Features

- 🌍 **Multi-language Support**: Available in English (CA-EN), French (CA-FR), and Brazilian Portuguese (BR-PT)
- 😺 **AI-Powered Cat Persona**: Morgana responds with personality using Google Gemini 2.5-flash
- 🎨 **Theme Toggle**: Switch between light and dark modes
- 📊 **Live Test Dashboard**: View real-time test coverage and metrics at `/tests`
- 📧 **Contact Form**: Get in touch directly through the app

---

## Tech Stack

### Frontend
*   **React 19** - UI framework
*   **react-i18next** - Internationalization (EN/FR/PT)
*   **react-router-dom** - Client-side routing

### Backend
*   **Python 3.11+** - Runtime
*   **Flask** - Web framework
*   **Flask-CORS** - Cross-origin support
*   **Flask-Mail** - Email integration
*   **Google Gemini 2.5-flash** - AI model

### Testing & Quality
*   **pytest + pytest-flask** - Backend unit & integration tests
*   **pytest-cov** - Code coverage reporting (90%+ coverage required)
*   **Playwright** - Frontend E2E tests
*   **pylint** - Python code quality enforcement

---

## Test Coverage

The project maintains comprehensive automated testing with deployment gates:

**Backend Tests (pytest)**
- 22 unit and integration tests
- 90%+ code coverage requirement
- Tests for all routes, models, and services
- Usage tracker excluded from coverage (API cost management)

**Frontend Tests (Playwright)**
- 21 E2E tests across all pages
- Component interaction testing
- Multi-language UI validation
- Accessibility checks

**View Live Metrics**: Navigate to `/tests` in the application to see real-time test coverage and results.

**CI/CD Integration**: GitHub Actions workflows automatically run tests on all PRs and block deployment if coverage falls below 80% or any tests fail.

---

## Development

### Environment Variables (Backend)

Required in production (Render):
```
GOOGLE_API_KEY=your_gemini_api_key
MAIL_USERNAME=your_gmail_address
MAIL_PASSWORD=your_gmail_app_password
```

Optional (with defaults):
```
SECRET_KEY=your_flask_secret_key
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
```

### Running Tests

**Backend:**
```bash
cd server
pytest
```

**Frontend:**
```bash
cd client
npm run test:e2e
```

**Generate Test Report:**
```bash
python scripts/generate_test_report.py
```
