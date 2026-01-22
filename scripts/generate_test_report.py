#!/usr/bin/env python3
"""
Test Report Generator
Generates a comprehensive test report JSON file for the dashboard.
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path


def generate_test_report():
    """Generate comprehensive test report from backend and frontend tests."""
    
    backend_coverage = load_backend_coverage()
    frontend_results = load_frontend_results()
    
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
        "environment": "dev",
        "backend": {
            "framework": "pytest + pytest-flask",
            "coverage": backend_coverage,
            "tests": get_backend_test_stats()
        },
        "frontend": {
            "framework": "Playwright",
            "tests": frontend_results
        },
        "stack": {
            "backend": ["Python 3.11+", "Flask", "pytest", "pytest-flask", "pytest-cov"],
            "frontend": ["React 19", "Playwright", "Jest"]
        }
    }
    
    output_path = Path(__file__).parent.parent / "client" / "public" / "test-report.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
    
    print(f"✓ Test report generated: {output_path}")
    return report


def load_backend_coverage():
    """Load backend test coverage from coverage.json."""
    coverage_file = Path(__file__).parent.parent / "server" / "coverage.json"
    
    if not coverage_file.exists():
        return {"percentage": 0, "lines_covered": 0, "lines_total": 0}
    
    try:
        with open(coverage_file, 'r') as f:
            data = json.load(f)
            totals = data.get('totals', {})
            return {
                "percentage": round(totals.get('percent_covered', 0), 2),
                "lines_covered": totals.get('covered_lines', 0),
                "lines_total": totals.get('num_statements', 0)
            }
    except Exception as e:
        print(f"Warning: Could not load backend coverage: {e}")
        return {"percentage": 0, "lines_covered": 0, "lines_total": 0}


def get_backend_test_stats():
    """Get backend test statistics from pytest JSON report."""
    results_file = Path(__file__).parent.parent / "server" / "test-results.json"
    
    if not results_file.exists():
        return {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "duration": 0
        }
    
    try:
        with open(results_file, 'r') as f:
            data = json.load(f)
            summary = data.get('summary', {})
            
            return {
                "total": summary.get('total', 0),
                "passed": summary.get('passed', 0),
                "failed": summary.get('failed', 0),
                "skipped": summary.get('skipped', 0),
                "duration": round(data.get('duration', 0), 2)
            }
    except Exception as e:
        print(f"Warning: Could not load backend test stats: {e}")
        return {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "duration": 0
        }


def load_frontend_results():
    """Load frontend Playwright test results from JSON output."""
    # Playwright outputs JSON directly to stdout, not to a file by default
    # We'll look for the results in test-results directory
    results_file = Path(__file__).parent.parent / "client" / "test-results" / "results.json"
    
    if not results_file.exists():
        return {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "duration": 0
        }
    
    try:
        with open(results_file, 'r') as f:
            data = json.load(f)
            stats = data.get('stats', {})
            
            total = stats.get('expected', 0) + stats.get('unexpected', 0) + stats.get('flaky', 0) + stats.get('skipped', 0)
            passed = stats.get('expected', 0)
            failed = stats.get('unexpected', 0)
            skipped = stats.get('skipped', 0)
            duration_ms = stats.get('duration', 0)
            
            return {
                "total": total,
                "passed": passed,
                "failed": failed,
                "skipped": skipped,
                "duration": round(duration_ms / 1000, 2)  # Convert ms to seconds
            }
    except Exception as e:
        print(f"Warning: Could not load frontend test results: {e}")
        return {
            "total": 0,
            "passed": 0,
            "failed": 0,
            "skipped": 0,
            "duration": 0
        }


if __name__ == "__main__":
    try:
        report = generate_test_report()
        sys.exit(0)
    except Exception as e:
        print(f"Error generating test report: {e}")
        sys.exit(1)
