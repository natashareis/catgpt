"""
Usage Tracking Service
Handles API usage tracking and cost calculation for the Gemini API.
"""

import os
import json
from datetime import datetime


class UsageTracker:
    """Tracks API usage and enforces monthly cost limits."""
    
    # Pricing for Gemini 2.5-flash: $0.075 per 1M input tokens, $0.30 per 1M output tokens
    INPUT_TOKEN_PRICE = 0.075 / 1_000_000  # Price per input token
    OUTPUT_TOKEN_PRICE = 0.30 / 1_000_000  # Price per output token
    
    def __init__(self, tracker_file=None, max_monthly_cost=1.0):
        """
        Initialize the usage tracker.
        
        Args:
            tracker_file: Path to the usage tracking file
            max_monthly_cost: Maximum monthly cost in USD (default: $1.00)
        """
        self.tracker_file = tracker_file or os.getenv('USAGE_TRACKER_FILE', '/tmp/catgpt_usage.json')
        self.max_monthly_cost = max_monthly_cost
    
    def get_usage_data(self):
        """Load usage data from file."""
        try:
            if os.path.exists(self.tracker_file):
                with open(self.tracker_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error reading usage file: {e}")
        
        return {
            "month": datetime.now().strftime("%Y-%m"),
            "total_cost": 0.0,
            "input_tokens": 0,
            "output_tokens": 0,
            "requests": 0
        }
    
    def save_usage_data(self, data):
        """Save usage data to file."""
        try:
            os.makedirs(os.path.dirname(self.tracker_file), exist_ok=True)
            with open(self.tracker_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error writing usage file: {e}")
    
    def check_monthly_usage(self):
        """Check if usage data is from current month, reset if needed."""
        usage_data = self.get_usage_data()
        current_month = datetime.now().strftime("%Y-%m")
        
        if usage_data.get("month") != current_month:
            # Reset for new month
            return {
                "month": current_month,
                "total_cost": 0.0,
                "input_tokens": 0,
                "output_tokens": 0,
                "requests": 0
            }
        return usage_data
    
    def calculate_token_cost(self, input_tokens, output_tokens):
        """
        Calculate cost based on token usage.
        
        Args:
            input_tokens: Number of input tokens
            output_tokens: Number of output tokens
            
        Returns:
            Total cost in USD
        """
        input_cost = input_tokens * self.INPUT_TOKEN_PRICE
        output_cost = output_tokens * self.OUTPUT_TOKEN_PRICE
        return input_cost + output_cost
    
    def update_usage(self, input_tokens, output_tokens):
        """
        Update usage tracking and return usage information.
        
        Args:
            input_tokens: Number of input tokens used
            output_tokens: Number of output tokens used
            
        Returns:
            Dictionary with usage information and limit status
        """
        usage_data = self.check_monthly_usage()
        
        # Calculate new cost
        new_cost = self.calculate_token_cost(input_tokens, output_tokens)
        total_cost = usage_data.get("total_cost", 0) + new_cost
        
        # Update tracking
        usage_data["total_cost"] = total_cost
        usage_data["input_tokens"] = usage_data.get("input_tokens", 0) + input_tokens
        usage_data["output_tokens"] = usage_data.get("output_tokens", 0) + output_tokens
        usage_data["requests"] = usage_data.get("requests", 0) + 1
        usage_data["month"] = datetime.now().strftime("%Y-%m")
        
        self.save_usage_data(usage_data)
        
        limit_exceeded = total_cost > self.max_monthly_cost
        
        return {
            "limit_exceeded": limit_exceeded,
            "total_cost": round(total_cost, 4),
            "remaining_budget": round(self.max_monthly_cost - total_cost, 4),
            "input_tokens": usage_data["input_tokens"],
            "output_tokens": usage_data["output_tokens"],
            "requests": usage_data["requests"]
        }
    
    def is_limit_exceeded(self):
        """
        Check if monthly usage limit has been exceeded.
        
        Returns:
            Tuple of (exceeded: bool, current_cost: float)
        """
        usage_data = self.check_monthly_usage()
        current_cost = usage_data.get("total_cost", 0)
        return current_cost >= self.max_monthly_cost, current_cost
