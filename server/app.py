"""
CatsGPT Backend Application
Main entry point for the Flask application.
"""

import os
import sys
import socket
import google.generativeai as genai
from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from dotenv import load_dotenv

# Add the server directory to Python path for module imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from routes import health_bp, chat_bp, init_contact_routes


load_dotenv()

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
app.secret_key = os.getenv('SECRET_KEY', 'catgpt-secret-key-change-in-production')

CORS(app)

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_ASCII_ATTACHMENTS'] = True
mail = Mail(app)

# Fix for SMTP encoding issues with non-ASCII hostnames
original_getfqdn = socket.getfqdn
socket.getfqdn = lambda name='': 'localhost'

# Configure Google Gemini API
google_api_key = os.getenv("GOOGLE_API_KEY")
if google_api_key:
    genai.configure(api_key=google_api_key)

app.register_blueprint(health_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(init_contact_routes(mail))

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)