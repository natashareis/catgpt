"""
Routes package
Contains all route blueprints for the application.
"""

from .health_routes import health_bp
from .chat_routes import chat_bp
from .contact_routes import contact_bp, init_contact_routes

__all__ = ['health_bp', 'chat_bp', 'contact_bp', 'init_contact_routes']
