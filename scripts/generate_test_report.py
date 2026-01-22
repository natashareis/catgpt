#!/usr/bin/env python3
"""
Test Report Generator
Generates a comprehensive test report JSON file for the dashboard.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path


def generate_test_report():
    """Generate comprehensive test report from backend and frontend tests."""
    
    backend_coverage = load_backend_coverage()
    frontend_results = load_frontend_results()
    
    report = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
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
    """Get backend test statistics."""
    return {
        "total": 0,
        "passed": 0,
        "failed": 0,
        "skipped": 0,
        "duration": 0
    }


def load_frontend_results():
    """Load frontend Playwright test results."""
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
            suites = data.get('suites', [])
            
            total = 0
            passed = 0
            failed = 0
            skipped = 0
            
            for suite in suites:
                for spec in suite.get('specs', []):
                    for test in spec.get('tests', []):
                        total += 1
                        results = test.get('results', [])
                        if results:
                            status = results[0].get('status', 'unknown')
                            if status == 'passed':
                                passed += 1
                            elif status == 'failed':
                                failed += 1
                            elif status == 'skipped':
                                skipped += 1
            
            return {
                "total": total,
                "passed": passed,
                "failed": failed,
                "skipped": skipped,
                "duration": 0
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
