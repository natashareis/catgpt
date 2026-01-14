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
          <h2>Who I Am</h2>
          <div className="about-bio-group">
            <p className="about-passion">
              I'm a builder at heart. I love creating things that matter, whether it's crafting robust automation frameworks, designing full-stack applications, or experimenting with LLMs and AI. I'm driven by the challenge of solving complex problems with elegant solutions.
            </p>
            <p className="about-bio">
              Fluent in Portuguese, English, Spanish, and French. Based in the Greater Montreal Area and passionate about merging technical expertise with creative storytelling.
            </p>
            <p className="about-personal">
              When I'm not coding, you'll find me with a warm cup of coffee and a physical book in hand. I'm a writer and cosplayer who believes imagination fuels innovation. I have a deep love for all things fluffy and cozy, hence why Morgana exists! 🐱
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>What I Build</h2>
          <div className="tech-stack">
            <span className="tech-badge">Testing Frameworks</span>
            <span className="tech-badge">Automation Scripts</span>
            <span className="tech-badge">Web Automation</span>
            <span className="tech-badge">API Testing</span>
            <span className="tech-badge">Full-Stack Apps</span>
            <span className="tech-badge">Python</span>
            <span className="tech-badge">React</span>
            <span className="tech-badge">Angular</span>
            <span className="tech-badge">SQL & NoSQL</span>
            <span className="tech-badge">Cloud & CI/CD</span>
            <span className="tech-badge">AI Integrations</span>
            <span className="tech-badge">LLM Applications</span>
          </div>
        </section>

        <section className="about-section">
          <h2>My Journey</h2>
          <div className="about-bio-group">
            <p className="about-bio">
              With nearly two decades of experience in quality assurance and several years exploring full-stack development, I've had the privilege of working across diverse technical landscapes. From building enterprise testing frameworks to creating modern web applications, I've learned that the best technology is the kind that empowers people.
            </p>
            <p className="about-bio">
              More recently, I've been fascinated by the intersection of AI and practical product building, exploring how LLMs can enhance our tools and create better user experiences. Morgana is one such experiment: a chatbot with personality.
            </p>
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
