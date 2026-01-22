"""
Chat Routes
Handles chat interactions with Morgana the cat using Gemini AI.
"""

import os
import google.generativeai as genai
from flask import Blueprint, request, jsonify

from models import CAT_PERSONA_PROMPT_EN, CAT_PERSONA_PROMPT_FR, CAT_PERSONA_PROMPT_PT
from services import UsageTracker


chat_bp = Blueprint('chat', __name__)

# Initialize usage tracker
MAX_MONTHLY_COST_USD = 1.0  # $1 USD per month limit
usage_tracker = UsageTracker(max_monthly_cost=MAX_MONTHLY_COST_USD)


@chat_bp.route('/chat', methods=['POST'])
def chat():
    """
    Handle chat messages to Morgana the cat.
    
    Expects JSON payload:
        - message: User's message
        - language: Language code ('en' or 'fr', defaults to 'en')
    
    Returns:
        JSON response with cat's reply and usage information
    """
    google_api_key = os.getenv("GOOGLE_API_KEY")
    
    data = request.get_json() 
    user_message = data.get('message')
    language = data.get('language', 'en')

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    if not google_api_key:
        return jsonify({"error": "Google API key not configured"}), 500

    try:
        limit_exceeded, current_cost = usage_tracker.is_limit_exceeded()
        
        if limit_exceeded:
            return jsonify({
                "error": "usage_limit_exceeded",
                "message": "Monthly usage limit reached",
                "total_cost": round(current_cost, 4),
                "limit": MAX_MONTHLY_COST_USD
            }), 429
        
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        if language == 'fr':
            persona_prompt = CAT_PERSONA_PROMPT_FR
        elif language == 'pt':
            persona_prompt = CAT_PERSONA_PROMPT_PT
        else:
            persona_prompt = CAT_PERSONA_PROMPT_EN
            
        full_prompt = f"{persona_prompt}\n\nUser: {user_message}\nMorgana:"
        
        response = model.generate_content(full_prompt)
        
        input_tokens = len(full_prompt.split())
        output_tokens = len(response.text.split())
        
        try:
            token_count_response = model.count_tokens(full_prompt)
            if hasattr(token_count_response, 'total_tokens'):
                input_tokens = token_count_response.total_tokens
        except Exception:
            pass
        
        usage_info = usage_tracker.update_usage(input_tokens, output_tokens)
        
        return jsonify({
            "reply": response.text,
            "usage": usage_info
        })

    except Exception as e:
        print(f"An error occurred in chat endpoint: {e}")
        return jsonify({"error": "An error occurred while processing your request."}), 500
