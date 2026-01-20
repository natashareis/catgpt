"""
Health Check Routes
Handles basic health check and status endpoints.
"""

import os
from flask import Blueprint, jsonify


health_bp = Blueprint('health', __name__)


@health_bp.route('/', methods=['GET'])
def health_check():
    """Check if the backend is running and properly configured."""
    google_api_key = os.getenv("GOOGLE_API_KEY")
    
    if google_api_key:
        return jsonify({"status": "ok", "message": "CatsGPT backend is running"}), 200
    else:
        return jsonify({"status": "error", "message": "GOOGLE_API_KEY not configured"}), 500
