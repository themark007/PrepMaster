// src/components/ProFeaturesPage.jsx
import React, { useState, useEffect } from 'react';
import './ProFeaturesPage.css';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiCreditCard, FiCheck, FiLoader, FiArrowLeft } from 'react-icons/fi';
import { FaBrain, FaMapMarkedAlt, FaRocket, FaCrown } from 'react-icons/fa';

const ProFeaturesPage = () => {
  const [activePlan, setActivePlan] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success'
  const [user, setUser] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
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
      icon: <FaBrain className="plan-icon-svg" />
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
      icon: <FaMapMarkedAlt className="plan-icon-svg" />
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
      icon: <FaRocket className="plan-icon-svg" />
    }
  ];

  const handlePlanSelect = (id) => {
    setIsAnimating(true);
    setActivePlan(id);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      setShowLogin(false);
    }, 1500);
  };

  const handlePayment = () => {
    if (!activePlan) return;
    
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus('success');
      
      // Show coming soon after success
      setTimeout(() => {
        setPaymentStatus('coming-soon');
      }, 3000);
    }, 2500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLogin(true);
    setPaymentStatus(null);
    setUser({ email: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const resetFlow = () => {
    setPaymentStatus(null);
    setActivePlan(null);
  };

  return (
    <div className="pro-features-page">
      {!isLoggedIn && showLogin ? (
        <div className="login-container scale-in">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon">
                <FiLock size={24} />
              </div>
              <h2>Welcome to Pro Features</h2>
              <p>Login to continue</p>
            </div>
            
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <FiUser className="input-icon" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email address"
                  value={user.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="input-group">
                <FiLock className="input-icon" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="spin" /> Processing...
                  </>
                ) : (
                  "Login to Continue"
                )}
              </button>
            </form>
            
            <div className="login-footer">
              <p>Just exploring? Use any credentials to continue</p>
            </div>
          </div>
        </div>
      ) : paymentStatus ? (
        <div className="payment-result">
          {paymentStatus === 'processing' && (
            <div className="processing-container fade-in">
              <div className="loader">
                <FiLoader className="spin" size={48} />
              </div>
              <h2>Processing Payment</h2>
              <p>Please wait while we verify your payment details</p>
              <div className="payment-details">
                <p>Plan: {plans.find(p => p.id === activePlan).title}</p>
                <p>Amount: {plans.find(p => p.id === activePlan).price}</p>
              </div>
            </div>
          )}
          
          {paymentStatus === 'success' && (
            <div className="success-container scale-in">
              <div className="success-icon">
                <FiCheck size={48} />
              </div>
              <h2>Payment Successful!</h2>
              <p>Thank you for upgrading to Pro</p>
              <div className="confetti"></div>
              <div className="confetti"></div>
              <div className="confetti"></div>
            </div>
          )}
          
          {paymentStatus === 'coming-soon' && (
            <div className="coming-soon-container fade-in">
              <div className="crown-icon">
                <FaCrown size={48} />
              </div>
              <h2>Coming Soon!</h2>
              <p>We're preparing these amazing features for you</p>
              <p>Stay tuned for the official launch</p>
              
              <button 
                className="back-btn"
                onClick={resetFlow}
              >
                <FiArrowLeft /> Back to Plans
              </button>
              
              <button 
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="header-container">
            <div className="animated-background"></div>
            <div className="user-info">
              <div className="user-avatar">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="user-actions">
                <span>{user.email || 'user@example.com'}</span>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
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
            <button 
              className="pay-now-btn" 
              disabled={!activePlan}
              onClick={handlePayment}
            >
              {activePlan 
                ? `Proceed to Payment - ${plans.find(p => p.id === activePlan).price}` 
                : 'Select a Plan to Continue'}
              <FiCreditCard className="btn-icon" />
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
        </>
      )}
    </div>
  );
};

export default ProFeaturesPage;