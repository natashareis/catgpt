import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Tests.css';

function Tests() {
  const { t } = useTranslation();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/test-report.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load test report');
        }
        return response.json();
      })
      .then(data => {
        setTestData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="Tests" data-testid="tests-container">
        <div className="tests-loading">{t('tests.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Tests" data-testid="tests-container">
        <div className="tests-error">
          <h2>{t('tests.error')}</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!testData) {
    return null;
  }

  const backendCoverage = testData.backend?.coverage?.percentage || 0;
  const backendTests = testData.backend?.tests || {};
  const frontendTests = testData.frontend?.tests || {};
  
  const totalTests = (backendTests.total || 0) + (frontendTests.total || 0);
  const totalPassed = (backendTests.passed || 0) + (frontendTests.passed || 0);
  const totalFailed = (backendTests.failed || 0) + (frontendTests.failed || 0);

  const getCoverageClass = (percentage) => {
    if (percentage >= 80) return 'coverage-good';
    if (percentage >= 60) return 'coverage-warning';
    return 'coverage-poor';
  };

  return (
    <div className="Tests" data-testid="tests-container">
      <header className="tests-header">
        <h1 data-testid="tests-title">{t('tests.title')}</h1>
        <p className="tests-subtitle" data-testid="tests-subtitle">{t('tests.subtitle')}</p>
      </header>

      <div className="tests-content">
        <section className="test-summary">
          <h2>{t('tests.summary')}</h2>
          <div className="summary-cards">
            <div className="summary-card" data-testid="summary-total">
              <div className="card-value">{totalTests}</div>
              <div className="card-label">{t('tests.totalTests')}</div>
            </div>
            <div className="summary-card success" data-testid="summary-passed">
              <div className="card-value">{totalPassed}</div>
              <div className="card-label">{t('tests.passed')}</div>
            </div>
            <div className="summary-card failure" data-testid="summary-failed">
              <div className="card-value">{totalFailed}</div>
              <div className="card-label">{t('tests.failed')}</div>
            </div>
          </div>
        </section>

        <section className="test-coverage">
          <h2>{t('tests.coverage')}</h2>
          <div className="coverage-card">
            <div className={`coverage-circle ${getCoverageClass(backendCoverage)}`} data-testid="coverage-percentage">
              <div className="coverage-value">{backendCoverage}%</div>
              <div className="coverage-label">{t('tests.backendCoverage')}</div>
            </div>
            <div className="coverage-details">
              <div className="coverage-stat">
                <span>{t('tests.linesCovered')}:</span>
                <strong>{testData.backend?.coverage?.lines_covered || 0} / {testData.backend?.coverage?.lines_total || 0}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="test-breakdown">
          <h2>{t('tests.breakdown')}</h2>
          <div className="breakdown-grid">
            <div className="breakdown-section">
              <h3>{t('tests.backendTests')}</h3>
              <div className="test-stats">
                <div className="stat-row">
                  <span>{t('tests.total')}:</span>
                  <strong>{backendTests.total || 0}</strong>
                </div>
                <div className="stat-row success">
                  <span>{t('tests.passed')}:</span>
                  <strong>{backendTests.passed || 0}</strong>
                </div>
                <div className="stat-row failure">
                  <span>{t('tests.failed')}:</span>
                  <strong>{backendTests.failed || 0}</strong>
                </div>
              </div>
            </div>

            <div className="breakdown-section">
              <h3>{t('tests.frontendTests')}</h3>
              <div className="test-stats">
                <div className="stat-row">
                  <span>{t('tests.total')}:</span>
                  <strong>{frontendTests.total || 0}</strong>
                </div>
                <div className="stat-row success">
                  <span>{t('tests.passed')}:</span>
                  <strong>{frontendTests.passed || 0}</strong>
                </div>
                <div className="stat-row failure">
                  <span>{t('tests.failed')}:</span>
                  <strong>{frontendTests.failed || 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="test-environment">
          <h2>{t('tests.environment')}</h2>
          <div className="env-info">
            <div className="env-row">
              <span>{t('tests.envName')}:</span>
              <strong>{testData.environment || 'dev'}</strong>
            </div>
            <div className="env-row">
              <span>{t('tests.lastRun')}:</span>
              <strong>
                {new Date(testData.timestamp).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                }).replace(/\//g, '/')}
              </strong>
            </div>
          </div>
        </section>

        <section className="test-stack">
          <h2>{t('tests.testingStack')}</h2>
          <div className="stack-grid">
            <div className="stack-section">
              <h3>{t('tests.backend')}</h3>
              <ul className="stack-list">
                {testData.stack?.backend?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="framework-label">{testData.backend?.framework}</p>
            </div>

            <div className="stack-section">
              <h3>{t('tests.frontend')}</h3>
              <ul className="stack-list">
                {testData.stack?.frontend?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="framework-label">{testData.frontend?.framework}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Tests;
