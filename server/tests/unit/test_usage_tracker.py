"""
Unit Tests for Usage Tracker Service
Tests usage tracking and cost calculation.

Note: These tests are excluded from coverage requirements to avoid
consuming API tokens during automated testing. The usage tracker
functionality is validated manually in production monitoring.
"""

import pytest
from services.usage_tracker import UsageTracker


@pytest.mark.unit
def test_usage_tracker_initialization(temp_tracker_file):
    """Test usage tracker initializes with correct values."""
    tracker = UsageTracker(tracker_file=temp_tracker_file, max_monthly_cost=1.0)
    assert tracker.max_monthly_cost == 1.0


@pytest.mark.unit
def test_usage_tracker_update_usage(temp_tracker_file):
    """Test usage tracker updates token counts and cost."""
    tracker = UsageTracker(tracker_file=temp_tracker_file, max_monthly_cost=10.0)
    
    usage_info = tracker.update_usage(input_tokens=1000, output_tokens=500)
    
    assert 'input_tokens' in usage_info
    assert 'output_tokens' in usage_info
    assert 'total_cost' in usage_info
    assert usage_info['input_tokens'] == 1000
    assert usage_info['output_tokens'] == 500
    assert usage_info['total_cost'] > 0


@pytest.mark.unit
def test_usage_tracker_limit_not_exceeded(temp_tracker_file):
    """Test usage tracker correctly identifies when limit is not exceeded."""
    tracker = UsageTracker(tracker_file=temp_tracker_file, max_monthly_cost=10.0)
    tracker.update_usage(input_tokens=100, output_tokens=50)
    
    limit_exceeded, current_cost = tracker.is_limit_exceeded()
    
    assert limit_exceeded is False
    assert current_cost > 0
    assert current_cost < 10.0


@pytest.mark.unit
def test_usage_tracker_cost_calculation(temp_tracker_file):
    """Test usage tracker calculates cost correctly."""
    tracker = UsageTracker(tracker_file=temp_tracker_file, max_monthly_cost=10.0)
    
    usage_info = tracker.update_usage(input_tokens=1_000_000, output_tokens=1_000_000)
    
    expected_cost = (1_000_000 * 0.075 / 1_000_000) + (1_000_000 * 0.30 / 1_000_000)
    assert abs(usage_info['total_cost'] - expected_cost) < 0.01
