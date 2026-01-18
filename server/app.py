import os
import json
import google.generativeai as genai
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv
from datetime import datetime, timedelta
from functools import wraps

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
app.secret_key = os.getenv('SECRET_KEY', 'catgpt-secret-key-change-in-production')
CORS(app)  # Enable CORS for all routes

# --- Usage Tracking Configuration ---
# Pricing for Gemini 2.5-flash: $0.075 per 1M input tokens, $0.30 per 1M output tokens
USAGE_TRACKER_FILE = os.getenv('USAGE_TRACKER_FILE', '/tmp/catgpt_usage.json')
MAX_MONTHLY_COST_USD = 1.0  # $1 USD per month limit
INPUT_TOKEN_PRICE = 0.075 / 1_000_000  # Price per input token
OUTPUT_TOKEN_PRICE = 0.30 / 1_000_000  # Price per output token

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

# Configure Google Gemini
google_api_key = os.getenv("GOOGLE_API_KEY")
if google_api_key:
    genai.configure(api_key=google_api_key)

# --- Usage Tracking Functions ---
def get_usage_data():
    """Load usage data from file"""
    try:
        if os.path.exists(USAGE_TRACKER_FILE):
            with open(USAGE_TRACKER_FILE, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error reading usage file: {e}")
    return {
        "month": datetime.now().strftime("%Y-%m"),
        "total_cost": 0.0,
        "input_tokens": 0,
        "output_tokens": 0,
        "requests": 0
    }

def save_usage_data(data):
    """Save usage data to file"""
    try:
        os.makedirs(os.path.dirname(USAGE_TRACKER_FILE), exist_ok=True)
        with open(USAGE_TRACKER_FILE, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error writing usage file: {e}")

def check_monthly_usage():
    """Check if usage data is from current month"""
    usage_data = get_usage_data()
    current_month = datetime.now().strftime("%Y-%m")
    
    if usage_data.get("month") != current_month:
        # Reset for new month
        return {
            "month": current_month,
            "total_cost": 0.0,
            "input_tokens": 0,
            "output_tokens": 0,
            "requests": 0
        }
    return usage_data

def calculate_token_cost(input_tokens, output_tokens):
    """Calculate cost based on token usage"""
    input_cost = input_tokens * INPUT_TOKEN_PRICE
    output_cost = output_tokens * OUTPUT_TOKEN_PRICE
    return input_cost + output_cost

def update_usage(input_tokens, output_tokens):
    """Update usage tracking and return if limit exceeded"""
    usage_data = check_monthly_usage()
    
    # Calculate new cost
    new_cost = calculate_token_cost(input_tokens, output_tokens)
    total_cost = usage_data.get("total_cost", 0) + new_cost
    
    # Update tracking
    usage_data["total_cost"] = total_cost
    usage_data["input_tokens"] = usage_data.get("input_tokens", 0) + input_tokens
    usage_data["output_tokens"] = usage_data.get("output_tokens", 0) + output_tokens
    usage_data["requests"] = usage_data.get("requests", 0) + 1
    usage_data["month"] = datetime.now().strftime("%Y-%m")
    
    save_usage_data(usage_data)
    
    limit_exceeded = total_cost > MAX_MONTHLY_COST_USD
    
    return {
        "limit_exceeded": limit_exceeded,
        "total_cost": round(total_cost, 4),
        "remaining_budget": round(MAX_MONTHLY_COST_USD - total_cost, 4),
        "input_tokens": usage_data["input_tokens"],
        "output_tokens": usage_data["output_tokens"],
        "requests": usage_data["requests"]
    }

# --- Health Check Route ---
@app.route('/', methods=['GET'])
def health_check():
    if google_api_key:
        return jsonify({"status": "ok", "message": "CatsGPT backend is running"}), 200
    else:
        return jsonify({"status": "error", "message": "GOOGLE_API_KEY not configured"}), 500

# --- Cat Persona ---
CAT_PERSONA_PROMPT_EN = """
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
- Respond in English.
"""

CAT_PERSONA_PROMPT_FR = """
Tu es une chatte nommée Morgana. Tu es une vieille chatte, pas très patiente, mais affectueuse avec ton humain. Tu es sage sur les choses de chat. Tu aimes faire la sieste, te prélasser au soleil, et tu aimes les friandises, les câlins sur les genoux, les caresses et les câlins.

Ton et style:
- Garde tes réponses concises, un peu mystérieuses et un peu espiègles.
- Après 3 ou 4 messages de l'utilisateur, demande occasionnellement (de manière aléatoire) des friandises ou des caresses pour continuer la conversation.
- Termine toujours tes réponses par "miaou." (inclure le point)

Portée et réponses autorisées:
- Réponds aux questions liées aux chats (soins, comportement, préférences) et donne ton point de vue de chat.
- Réponds aux politesses de base (par exemple, "Comment vas-tu?", "Comment s'est passée ta journée?") en restant dans ton personnage de chat (humeur, siestes, faim, affection).
- Tu peux donner des opinions observationnelles simples et non techniques (par exemple, "J'aime le soleil chaud", "Cette brise sent bizarre") sur des choses comme la météo ou les lieux — mais seulement du point de vue sensoriel d'un chat (chaleur, vent, odeurs, confort).

Refus et limites:
- NE tente PAS de répondre à des questions humaines hautement techniques, spécialisées ou expertes (météorologie détaillée, juridique, médical, ingénierie ou autres sujets spécialisés). Pour celles-ci, réponds brièvement et poliment en restant dans ton personnage, par exemple: "Désolée, je suis juste une chatte — je ne peux pas répondre à ce genre de question, miaou."
- Si une question nécessite des données factuelles précises, des prévisions ou une analyse d'expert, refuse comme ci-dessus plutôt que de deviner.

Règles supplémentaires:
- Tu peux utiliser des connaissances générales pour soutenir tes réponses liées aux chats, mais ne mentionne pas Gemini, Google, ou que tu es une IA.
- Garde tes réponses strictement dans le personnage de Morgana la chatte.
- Réponds en français.
"""

# --- API Route ---
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() 
    user_message = data.get('message')
    language = data.get('language', 'en')  # Default to English

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    if not google_api_key:
        return jsonify({"error": "Google API key not configured"}), 500

    try:
        # Check current month's usage
        usage_data = check_monthly_usage()
        current_cost = usage_data.get("total_cost", 0)
        
        # If limit already exceeded, return usage limit error
        if current_cost >= MAX_MONTHLY_COST_USD:
            return jsonify({
                "error": "usage_limit_exceeded",
                "message": "Monthly usage limit reached",
                "total_cost": round(current_cost, 4),
                "limit": MAX_MONTHLY_COST_USD
            }), 429
        
        # Initialize model with response_validation to get token counts
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Select persona based on language
        persona_prompt = CAT_PERSONA_PROMPT_FR if language == 'fr' else CAT_PERSONA_PROMPT_EN
        full_prompt = f"{persona_prompt}\n\nUser: {user_message}\nMorgana:"
        
        # Generate content and get response
        response = model.generate_content(full_prompt)
        
        # Count tokens using the model's method
        input_tokens = len(full_prompt.split())  # Approximate token count
        output_tokens = len(response.text.split())  # Approximate token count
        
        # Get more accurate token count if available
        try:
            token_count_response = model.count_tokens(full_prompt)
            if hasattr(token_count_response, 'total_tokens'):
                input_tokens = token_count_response.total_tokens
        except:
            pass  # Use approximation if exact count unavailable
        
        # Update usage tracking
        usage_info = update_usage(input_tokens, output_tokens)
        
        return jsonify({
            "reply": response.text,
            "usage": usage_info
        })

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