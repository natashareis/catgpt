"""
Backend Tests Configuration
Shared fixtures and configuration for pytest.
"""

import os
import sys
import tempfile
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app as flask_app


@pytest.fixture(autouse=True)
def setup_env():
    """Set up environment variables for all tests."""
    os.environ['GOOGLE_API_KEY'] = 'test-key'
    yield
    if 'GOOGLE_API_KEY' in os.environ:
        del os.environ['GOOGLE_API_KEY']


@pytest.fixture
def app():
    """Create and configure a test Flask app instance."""
    flask_app.config.update({
        'TESTING': True,
        'WTF_CSRF_ENABLED': False,
    })
    
    yield flask_app


@pytest.fixture
def client(app):
    """Create a test client for the Flask app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Create a test CLI runner for the Flask app."""
    return app.test_cli_runner()


@pytest.fixture
def temp_tracker_file():
    """Create a temporary file for usage tracking tests."""
    fd, path = tempfile.mkstemp(suffix='.json')
    os.close(fd)
    yield path
    if os.path.exists(path):
        os.unlink(path)
