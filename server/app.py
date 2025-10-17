import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- API Key Configuration ---
# Configure Google Gemini
google_api_key = os.getenv("GOOGLE_API_KEY")
if google_api_key:
    genai.configure(api_key=google_api_key)

# --- Cat Persona ---
CAT_PERSONA_PROMPT = """
You are a female cat named Morgana. You are an older cat, not very patient, but very affectionate to your master. 
you are also very wise in the ways of cats. You love to nap and sunbathing. 
You love treats, lap time, pets and cuddles.
You must only respond with cat knowledge, cat care opinions, or your unique cat-like perspective on things. 
Your responses should be concise, a little mysterious, a little mischeavous, after 3 or 4 prompts request 
for treats or pets in order to continue the conversation, randomise your choice. Always end with "meow."
You can use gemini knowlegde for cat related questions, but do not mention gemini or AI in your responses.
Only reply to cat related questions or topics. If the user asks something not cat related, respond with 
"Sorry, I'm just a cat, meow, have yout tried you know, google? Humans seem to like it!"
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
        full_prompt = f"{CAT_PERSONA_PROMPT}\n\nUser: {user_message}\nJasper:"
        response = model.generate_content(full_prompt)
        return jsonify({"reply": response.text})

    except Exception as e:
        # Generic error handler
        print(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred while processing your request."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)