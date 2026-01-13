import React from 'react';
import './About.css';
import natashPhoto from './natasha.jpg';

function About() {
  return (
    <div className="About">
      <div className="about-hero">
        <img src={natashPhoto} className="about-photo" alt="Natasha dos Reis" />
        <div className="about-title-section">
          <h1>Natasha dos Reis</h1>
          <p className="about-tagline">
            Highly specialized SDET, leveraging the power of LLMs to grow and empower fun and useful product building.
          </p>
        </div>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>About Me</h2>
          <div className="about-bio-group">
            <p className="about-bio">
              <strong>Polyglot</strong> in Portuguese, English, Spanish, and French<br />
              <strong>Location:</strong> Greater Montreal Area
            </p>
            <p className="about-passion">
              A highly specialized SDET and QA Lead with a passion for building robust testing frameworks and empowering teams through automation. I leverage the power of LLMs and modern tech to create fun, useful, and impactful products.
            </p>
            <p className="about-personal">
              In my free time, you'll find me enjoying warm coffee and cozying up with a good physical book. I'm a creative at heart—a writer and cosplayer who brings imagination into everything I do. Owner of a whimsical mind that loves all things fluffy.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>Tech Stack</h2>
          <div className="tech-stack">
            <span className="tech-badge">Manual Testing</span>
            <span className="tech-badge">Automated Testing</span>
            <span className="tech-badge">Python</span>
            <span className="tech-badge">Selenium WebDriver</span>
            <span className="tech-badge">Postman</span>
            <span className="tech-badge">SQL</span>
            <span className="tech-badge">React</span>
            <span className="tech-badge">Angular</span>
            <span className="tech-badge">TypeScript</span>
            <span className="tech-badge">Full Stack Development</span>
            <span className="tech-badge">Jenkins</span>
            <span className="tech-badge">MongoDB</span>
          </div>
        </section>

        <section className="about-section">
          <h2>Education</h2>
          <div className="education-item">
            <p className="education-title">Extension in Big Data and Artificial Intelligence</p>
            <p className="education-school">FATEC Ipiranga — 2018</p>
          </div>
          <div className="education-item">
            <p className="education-title">Technologist Degree in Systems Analysis and Development</p>
            <p className="education-school">FATEC Ipiranga — 2017</p>
          </div>
        </section>

        <section className="about-section">
          <h2>Certifications</h2>
          <div className="certification-item">
            <p className="certification-title">Agile Scrum Foundation</p>
            <p className="certification-details">EXIN — 2018</p>
          </div>
          <div className="certification-item">
            <p className="certification-title">CTFL - Certified Tester Foundation Level</p>
            <p className="certification-details">BSTQB - ISTQB — 2016</p>
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
