import React from 'react';
import { useTranslation } from 'react-i18next';
import './About.css';

function About() {
  const { t } = useTranslation();
  
  // Fallback tech stack in case translation doesn't load properly
  const fallbackTechStack = [
    "Testing Frameworks",
    "Automation Scripts",
    "Web Automation",
    "API Testing",
    "Full-Stack Apps",
    "Python",
    "React",
    "Angular",
    "SQL & NoSQL",
    "Cloud & CI/CD",
    "AI Integrations",
    "LLM Applications"
  ];
  
  const techStackData = t('about.techStack', { returnObjects: true });
  const techStack = (Array.isArray(techStackData) && techStackData.length > 0) 
    ? techStackData 
    : fallbackTechStack;

  return (
    <div className="About">
      <div className="about-hero">
        <img src="/natasha.jpg" className="about-photo" alt="Natasha dos Reis" />
        <div className="about-title-section">
          <h1>{t('about.name')}</h1>
          <p className="about-tagline">
            {t('about.tagline')}
          </p>
        </div>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>{t('about.whoIAm')}</h2>
          <div className="about-bio-group">
            <p className="about-passion">
              {t('about.passion')}
            </p>
            <p className="about-bio">
              {t('about.bio')}
            </p>
            <p className="about-personal">
              {t('about.personal')}
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>{t('about.whatIBuild')}</h2>
          <div className="tech-stack">
            {techStack.map((tech, index) => (
              <span key={index} className="tech-badge">{tech}</span>
            ))}
          </div>
        </section>

        <section className="about-section about-cta">
          <a href="https://www.linkedin.com/in/natasha-dos-reis-98987431" target="_blank" rel="noopener noreferrer" className="linkedin-button">
            Connect on LinkedIn
          </a>
        </section>
      </div>
    </div>
  );
}

export default About;
