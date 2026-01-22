"""
Integration Tests for Chat Routes
Tests chat endpoint with different languages and scenarios.
"""

import pytest
from unittest.mock import patch, MagicMock


@pytest.mark.integration
def test_chat_endpoint_missing_message(client):
    """Test chat endpoint returns 400 when message is missing."""
    response = client.post('/chat', json={})
    
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data


@pytest.mark.integration
def test_chat_endpoint_empty_message(client):
    """Test chat endpoint returns 400 for empty message."""
    response = client.post('/chat', json={'message': ''})
    
    assert response.status_code == 400


@pytest.mark.integration
@patch('routes.chat_routes.genai.GenerativeModel')
def test_chat_endpoint_english(mock_model_class, client):
    """Test chat endpoint with English language."""
    mock_model = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Meow, I am Morgana, meow."
    mock_model.generate_content.return_value = mock_response
    mock_model.count_tokens.side_effect = Exception("Not available")
    mock_model_class.return_value = mock_model
    
    response = client.post('/chat', json={
        'message': 'Hello Morgana',
        'language': 'en'
    })
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'reply' in data
    assert 'usage' in data


@pytest.mark.integration
@patch('routes.chat_routes.genai.GenerativeModel')
def test_chat_endpoint_french(mock_model_class, client):
    """Test chat endpoint with French language."""
    mock_model = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Miaou, je suis Morgana, miaou."
    mock_model.generate_content.return_value = mock_response
    mock_model.count_tokens.side_effect = Exception("Not available")
    mock_model_class.return_value = mock_model
    
    response = client.post('/chat', json={
        'message': 'Bonjour Morgana',
        'language': 'fr'
    })
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'reply' in data


@pytest.mark.integration
@patch('routes.chat_routes.genai.GenerativeModel')
def test_chat_endpoint_portuguese(mock_model_class, client):
    """Test chat endpoint with Portuguese language."""
    mock_model = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Miau, eu sou Morgana, miau."
    mock_model.generate_content.return_value = mock_response
    mock_model.count_tokens.side_effect = Exception("Not available")
    mock_model_class.return_value = mock_model
    
    response = client.post('/chat', json={
        'message': 'Olá Morgana',
        'language': 'pt'
    })
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'reply' in data


@pytest.mark.integration
@patch('routes.chat_routes.genai.GenerativeModel')
def test_chat_endpoint_default_language(mock_model_class, client):
    """Test chat endpoint defaults to English when language not specified."""
    mock_model = MagicMock()
    mock_response = MagicMock()
    mock_response.text = "Meow."
    mock_model.generate_content.return_value = mock_response
    mock_model.count_tokens.side_effect = Exception("Not available")
    mock_model_class.return_value = mock_model
    
    response = client.post('/chat', json={
        'message': 'Hi'
    })
    
    assert response.status_code == 200
