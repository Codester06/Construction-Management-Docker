import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaProjectDiagram, FaUsers, FaBoxes, FaChartLine, FaRocket, FaShieldAlt, FaClock, FaMobile, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <FaRocket /> Powered by Docker
          </div>
          <h1 className="hero-title">
            Build Better with
            <span className="gradient-text"> Smart Construction</span>
          </h1>
          <p className="hero-subtitle">
            The all-in-one platform to manage projects, track workers, monitor materials, 
            and generate insights for your construction business.
          </p>
          <div className="hero-buttons">
            <button className="cta-button" onClick={() => navigate('/dashboard')}>
              Get Started <FaArrowRight />
            </button>
            <button className="cta-button-outline" onClick={() => navigate('/dashboard')}>
              View Demo
            </button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <FaCheckCircle className="check-icon" />
              <span>No Credit Card Required</span>
            </div>
            <div className="hero-stat">
              <FaCheckCircle className="check-icon" />
              <span>Free Forever</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <FaProjectDiagram className="card-icon" />
            <div className="card-text">
              <h4>15 Projects</h4>
              <p>Active</p>
            </div>
          </div>
          <div className="floating-card card-2">
            <FaUsers className="card-icon" />
            <div className="card-text">
              <h4>48 Workers</h4>
              <p>On Site</p>
            </div>
          </div>
          <div className="floating-card card-3">
            <FaBoxes className="card-icon" />
            <div className="card-text">
              <h4>250 Items</h4>
              <p>In Stock</p>
            </div>
          </div>
          <div className="hero-circle circle-1"></div>
          <div className="hero-circle circle-2"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-subtitle">Powerful features designed for modern construction management</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper primary">
              <FaProjectDiagram className="feature-icon" />
            </div>
            <h3>Project Management</h3>
            <p>Track budgets, timelines, and status for all your construction projects in real-time</p>
            <ul className="feature-list">
              <li><FaCheckCircle /> Budget tracking</li>
              <li><FaCheckCircle /> Timeline management</li>
              <li><FaCheckCircle /> Status updates</li>
            </ul>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper success">
              <FaUsers className="feature-icon" />
            </div>
            <h3>Worker Management</h3>
            <p>Organize your workforce, assign tasks, and track attendance efficiently</p>
            <ul className="feature-list">
              <li><FaCheckCircle /> Role assignments</li>
              <li><FaCheckCircle /> Salary tracking</li>
              <li><FaCheckCircle /> Performance metrics</li>
            </ul>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper warning">
              <FaBoxes className="feature-icon" />
            </div>
            <h3>Material Tracking</h3>
            <p>Monitor inventory levels and get automatic alerts for low stock items</p>
            <ul className="feature-list">
              <li><FaCheckCircle /> Real-time inventory</li>
              <li><FaCheckCircle /> Low stock alerts</li>
              <li><FaCheckCircle /> Supplier management</li>
            </ul>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper info">
              <FaChartLine className="feature-icon" />
            </div>
            <h3>Analytics & Reports</h3>
            <p>Get actionable insights with beautiful charts and comprehensive reports</p>
            <ul className="feature-list">
              <li><FaCheckCircle /> Visual dashboards</li>
              <li><FaCheckCircle /> Custom reports</li>
              <li><FaCheckCircle /> Export data</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">
              <FaShieldAlt />
            </div>
            <h3>Secure & Reliable</h3>
            <p>Enterprise-grade security with 99.9% uptime guarantee</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <FaClock />
            </div>
            <h3>Save Time</h3>
            <p>Automate workflows and reduce manual data entry by 80%</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <FaMobile />
            </div>
            <h3>Mobile Ready</h3>
            <p>Access from anywhere on any device, anytime</p>
          </div>
          <div className="benefit-item">
            <div className="benefit-icon">
              <FaChartLine />
            </div>
            <h3>Data-Driven</h3>
            <p>Make informed decisions with real-time analytics</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Projects Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2,000+</div>
            <div className="stat-label">Workers Managed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Materials Tracked</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Construction Management?</h2>
          <p>Join thousands of construction professionals who trust our platform</p>
          <button className="cta-button-large" onClick={() => navigate('/dashboard')}>
            Launch Dashboard <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <FaProjectDiagram className="footer-icon" />
            <span>Construction Management</span>
          </div>
          <p>&copy; 2026 Construction Management System. Built with Docker & React.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
