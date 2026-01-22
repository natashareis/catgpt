import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';

function About() {
  const { t, ready } = useTranslation();
  
  const fallbackTechStack = [
    "Testing Frameworks",
    "Automation Scripts",
    "Full-Stack Apps",
    "Python",
    "React",
    "Angular",
    "SQL & NoSQL",
    "AI Integrations",
    "LLM Applications"
  ];
  
  const techStackData = ready ? t('about.techStack', { returnObjects: true }) : fallbackTechStack;
  const techStack = (Array.isArray(techStackData) && techStackData.length > 0) 
    ? techStackData 
    : fallbackTechStack;

  return (
    <div className="About" data-testid="about-container">
      <div className="about-hero" data-testid="about-hero">
        <img src="/natasha.jpg" className="about-photo" alt="Natasha Dos Reis" data-testid="about-photo" />
        <div className="about-title-section">
          <h1 data-testid="about-name">{t('about.name')}</h1>
          <p className="about-tagline" data-testid="about-tagline">
            {t('about.tagline')}
          </p>
        </div>
      </div>

      <div className="about-content" data-testid="about-content">
        <section className="about-section" data-testid="about-section-who">
          <h2 data-testid="about-who-heading">{t('about.whoIAm')}</h2>
          <div className="about-bio-group">
            <p className="about-passion" data-testid="about-passion">
              {t('about.passion')}
            </p>
            <p className="about-bio" data-testid="about-bio">
              {t('about.bio')}
            </p>
            <p className="about-personal" data-testid="about-personal">
              {t('about.personal')}
            </p>
          </div>
        </section>

        <section className="about-section" data-testid="about-section-build">
          <h2 data-testid="about-build-heading">{t('about.whatIBuild')}</h2>
          <div className="tech-stack" data-testid="tech-stack">
            {techStack.map((tech, index) => (
              <span key={index} className="tech-badge" data-testid={`tech-badge-${index}`}>{tech}</span>
            ))}
          </div>
        </section>

        <section className="about-section about-cta" data-testid="about-section-cta">
          <a href="https://www.linkedin.com/in/natasha-dos-reis-98987431" target="_blank" rel="noopener noreferrer" className="linkedin-button" data-testid="linkedin-button">
            {t('about.linkedinButton')}
          </a>
        </section>
      </div>
    </div>
  );
}

export default About;
