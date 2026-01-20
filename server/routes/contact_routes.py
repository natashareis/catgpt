"""
Contact Routes
Handles contact form submissions and email notifications.
"""

import os
from flask import Blueprint, request, jsonify
from flask_mail import Message


contact_bp = Blueprint('contact', __name__)


def init_contact_routes(mail):
    """
    Initialize contact routes with mail instance.
    
    Args:
        mail: Flask-Mail instance for sending emails
    """
    
    @contact_bp.route('/contact', methods=['POST'])
    def contact():
        """
        Handle contact form submissions.
        
        Expects JSON payload:
            - name: Sender's name
            - email: Sender's email address
            - message: Message content
        
        Returns:
            JSON response indicating success or failure
        """
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
    
    return contact_bp
