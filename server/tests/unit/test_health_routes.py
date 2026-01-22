"""
Unit Tests for Health Routes
Tests the health check endpoint.
"""

import pytest


@pytest.mark.unit
def test_health_endpoint(client):
    """Test health check endpoint returns 200 OK."""
    response = client.get('/')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['status'] == 'ok'
    assert data['message'] == 'CatsGPT backend is running'


@pytest.mark.unit
def test_health_endpoint_structure(client):
    """Test health check endpoint returns correct structure."""
    response = client.get('/')
    data = response.get_json()
    
    assert isinstance(data, dict)
    assert 'status' in data
    assert 'message' in data
    assert isinstance(data['message'], str)
