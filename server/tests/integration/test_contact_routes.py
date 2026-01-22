"""
Integration Tests for Contact Routes
Tests contact form submission endpoint.
"""

import pytest
from unittest.mock import patch, MagicMock


@pytest.mark.integration
def test_contact_endpoint_missing_fields(client):
    """Test contact endpoint returns 400 when required fields are missing."""
    response = client.post('/contact', json={
        'name': 'Test User'
    })
    
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data


@pytest.mark.integration
def test_contact_endpoint_invalid_email(client):
    """Test contact endpoint validates email format."""
    response = client.post('/contact', json={
        'name': 'Test User',
        'email': 'invalid-email',
        'message': 'Test message'
    })
    
    assert response.status_code == 400


@pytest.mark.integration
@patch('flask_mail.Mail.send')
def test_contact_endpoint_success(mock_send, client):
    """Test contact endpoint successfully processes valid submission."""
    response = client.post('/contact', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'message': 'This is a test message'
    })
    
    assert response.status_code in [200, 201]
    data = response.get_json()
    assert 'message' in data or 'success' in str(data).lower()


@pytest.mark.integration
def test_contact_endpoint_empty_message(client):
    """Test contact endpoint rejects empty message."""
    response = client.post('/contact', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'message': ''
    })
    
    assert response.status_code == 400
