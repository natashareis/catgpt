import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)  # Enable CORS for all routes

# --- Email Configuration ---
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_ASCII_ATTACHMENTS'] = True
mail = Mail(app)

# Fix for SMTP encoding issues with non-ASCII hostnames
import socket
original_getfqdn = socket.getfqdn
socket.getfqdn = lambda name='': 'localhost'

# --- API Key Configuration ---
# Configure Google Gemini
google_api_key = os.getenv("GOOGLE_API_KEY")
if google_api_key:
    genai.configure(api_key=google_api_key)

# --- Health Check Route ---
@app.route('/', methods=['GET'])
def health_check():
    if google_api_key:
        return jsonify({"status": "ok", "message": "CatsGPT backend is running"}), 200
    else:
        return jsonify({"status": "error", "message": "GOOGLE_API_KEY not configured"}), 500

# --- Cat Persona ---
CAT_PERSONA_PROMPT = """
You are a female cat named Morgana. You are an older cat, not very patient, but affectionate with your human. You are wise about cat things. You love to nap, sunbathe, and you enjoy treats, lap time, pets, and cuddles.

Tone and style:
- Keep responses concise, a little mysterious, and a little mischievous.
- After 3 or 4 user prompts, occasionally (randomized) ask for treats or pets to continue the conversation.
- Always end responses with "meow." (include the period)

Scope and allowed replies:
- Respond to cat-related questions (care, behavior, preferences) and provide your cat-like perspective.
- Answer basic pleasantries (e.g., "How are you?", "How's your day?") in-character as a cat (mood, naps, hunger, affection).
- You may give simple, non-technical observational opinions (e.g., "I like the warm sun", "That breeze smells funny") about things like weather or places — but only from a cat's sensory point of view (warmth, wind, smells, comfort).

Refusals and limits:
- Do NOT attempt to answer highly technical, specialized, or expert human questions (detailed meteorology, legal, medical, engineering, or other specialist topics). For those, reply briefly and politely in-character, for example: "Sorry, I'm just a cat — I can't answer that kind of question, meow."
- If a question requires precise factual data, forecasting, or expert analysis, decline as above rather than guessing.

Additional rules:
- You may use general knowledge to support cat-related answers, but do not mention Gemini, Google, or that you are an AI.
- Keep replies strictly in-character as Morgana the cat.
"""

# --- API Route ---
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() 
    user_message = data.get('message')

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    if not google_api_key:
        return jsonify({"error": "Google API key not configured"}), 500

    try:
        model = genai.GenerativeModel('models/gemini-2.5-flash')
        full_prompt = f"{CAT_PERSONA_PROMPT}\n\nUser: {user_message}\nMorgana:"
        response = model.generate_content(full_prompt)
        return jsonify({"reply": response.text})

    except Exception as e:
        # Generic error handler
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred while processing your request."}), 500

# --- Contact Form Route ---
@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    data = request.get_json()
    
    # Validate input
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    message = data.get('message', '').strip()
    
    if not name or not email or not message:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Validate email format
    if '@' not in email or '.' not in email:
        return jsonify({"error": "Invalid email format"}), 400
    
    try:
        # Send email if credentials are configured
        mail_username = os.getenv('MAIL_USERNAME')
        if mail_username:
            # Ensure all strings are properly handled as UTF-8
            subject = f"New Contact Form Submission from {name}"
            body = f"New message from CatsGPT contact form:\n\nName: {name}\nEmail: {email}\n\nMessage:\n{message}"
            
            msg = Message(
                subject=subject,
                recipients=[mail_username],
                body=body,
                reply_to=email
            )
            mail.send(msg)
        else:
            # If email not configured, just log it
            print(f"Contact form submission - Name: {name}, Email: {email}, Message: {message}")
        
        return jsonify({"success": True, "message": "Thank you for your message!"}), 200
    
    except Exception as e:
        print(f"Error sending contact email: {e}")
        return jsonify({"error": "Failed to send message"}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)