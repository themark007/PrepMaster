// src/components/ProFeaturesPage.jsx
import React, { useState, useEffect } from 'react';
import './ProFeaturesPage.css';

const ProFeaturesPage = () => {
  const [activePlan, setActivePlan] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const plans = [
    {
      id: 1,
      title: "Smart AI Integration",
      price: "₹100",
      features: [
        "AI-powered note summarization",
        "Intelligent keyword extraction",
        "Auto-categorization of notes",
        "Basic smart search"
      ],
      popular: false,
      icon: "🧠"
    },
    {
      id: 2,
      title: "AI + Memory Maps",
      price: "₹200",
      features: [
        "All Smart AI features",
        "Visual memory mapping",
        "Concept linking",
        "Knowledge graph visualization",
        "Spatial note organization"
      ],
      popular: true,
      icon: "🗺️"
    },
    {
      id: 3,
      title: "Full Pro Package",
      price: "₹300",
      features: [
        "All AI + Memory Map features",
        "Auto-generated question sets",
        "Spaced repetition quizzes",
        "Progress analytics",
        "Priority support",
        "Early access to new features"
      ],
      popular: false,
      icon: "🚀"
    }
  ];

  const handlePlanSelect = (id) => {
    setIsAnimating(true);
    setActivePlan(id);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="pro-features-page">
      <div className="header-container">
        <div className="animated-background"></div>
        <h1 className="bounce-in">Unlock Premium Features</h1>
        <p className="fade-in">Upgrade your note-taking experience with powerful AI tools</p>
      </div>
      
      <div className="features-grid">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`plan-card ${activePlan === plan.id ? 'active' : ''} ${isAnimating && activePlan === plan.id ? 'pulse' : ''} ${plan.popular ? 'popular' : ''}`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.popular && <div className="popular-badge">MOST POPULAR</div>}
            <div className="plan-icon">{plan.icon}</div>
            <h2>{plan.title}</h2>
            <div className="price">{plan.price}</div>
            <ul className="features-list">
              {plan.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="checkmark">✓</span> {feature}
                </li>
              ))}
            </ul>
            <button 
              className={`select-btn ${activePlan === plan.id ? 'selected' : ''}`}
            >
              {activePlan === plan.id ? '✓ Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="payment-cta">
        <button className="pay-now-btn" disabled={!activePlan}>
          {activePlan 
            ? `Proceed to Payment - ${plans.find(p => p.id === activePlan).price}` 
            : 'Select a Plan to Continue'}
        </button>
        <div className="secure-payment">
          🔒 Secure Payment • 256-bit Encryption
        </div>
      </div>
      
      <div className="testimonial-section">
        <div className="testimonial-card">
          <div className="quote">“The AI integration completely transformed how I study!”</div>
          <div className="user">
            <div className="avatar">A</div>
            <div className="info">
              <div className="name">Amit Sharma</div>
              <div className="title">Medical Student</div>
            </div>
          </div>
        </div>
        <div className="testimonial-card">
          <div className="quote">“Memory maps helped me visualize complex concepts like never before.”</div>
          <div className="user">
            <div className="avatar">P</div>
            <div className="info">
              <div className="name">Priya Patel</div>
              <div className="title">Software Engineer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProFeaturesPage;