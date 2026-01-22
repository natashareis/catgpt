"""
Unit Tests for Cat Personas
Tests the cat persona prompts for all languages.
"""

import pytest
from models import CAT_PERSONA_PROMPT_EN, CAT_PERSONA_PROMPT_FR, CAT_PERSONA_PROMPT_PT


@pytest.mark.unit
def test_english_persona_exists():
    """Test English persona prompt is defined and not empty."""
    assert CAT_PERSONA_PROMPT_EN is not None
    assert len(CAT_PERSONA_PROMPT_EN) > 0
    assert 'Morgana' in CAT_PERSONA_PROMPT_EN


@pytest.mark.unit
def test_french_persona_exists():
    """Test French persona prompt is defined and not empty."""
    assert CAT_PERSONA_PROMPT_FR is not None
    assert len(CAT_PERSONA_PROMPT_FR) > 0
    assert 'Morgana' in CAT_PERSONA_PROMPT_FR


@pytest.mark.unit
def test_portuguese_persona_exists():
    """Test Portuguese persona prompt is defined and not empty."""
    assert CAT_PERSONA_PROMPT_PT is not None
    assert len(CAT_PERSONA_PROMPT_PT) > 0
    assert 'Morgana' in CAT_PERSONA_PROMPT_PT


@pytest.mark.unit
def test_english_persona_contains_meow():
    """Test English persona includes 'meow' instruction."""
    assert 'meow' in CAT_PERSONA_PROMPT_EN.lower()


@pytest.mark.unit
def test_french_persona_contains_miaou():
    """Test French persona includes 'miaou' instruction."""
    assert 'miaou' in CAT_PERSONA_PROMPT_FR.lower()


@pytest.mark.unit
def test_portuguese_persona_contains_miau():
    """Test Portuguese persona includes 'miau' instruction."""
    assert 'miau' in CAT_PERSONA_PROMPT_PT.lower()
