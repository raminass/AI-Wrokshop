import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>AI Notes App</h3>
          <p>A microservices demo application showcasing AI-powered note categorization and analysis.</p>
        </div>
        
        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li>Frontend Service</li>
            <li>API Gateway</li>
            <li>Notes Service</li>
            <li>AI Service</li>
            <li>OpenAI Service</li>
            <li>Monitoring Service</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Technologies</h3>
          <ul>
            <li>React</li>
            <li>Express.js</li>
            <li>Docker</li>
            <li>Prometheus</li>
            <li>Grafana</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AI Microservices Demo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
