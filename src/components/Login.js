import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../authConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicPath } from '../envConfig';
import './Login.css';

function Login() {
  const { instance, accounts, inProgress } = useMsal();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const publicPath = getPublicPath();

  useEffect(() => {
    console.log("Login component state:", { 
      accountsCount: accounts.length, 
      inProgress
    });

    // If user is already logged in, redirect to the documents page
    if (accounts.length > 0) {
      console.log("User already logged in, redirecting to documents");
      navigate('/documents', { replace: true });
    }
  }, [accounts, inProgress, navigate]);

  // Clear any stuck interactions on component mount
  useEffect(() => {
    const clearStuckInteractions = async () => {
      try {
        console.log("Clearing any stuck interactions on component mount...");
        await instance.handleRedirectPromise();
      } catch (error) {
        console.warn("Error clearing stuck interactions:", error);
      }
    };

    clearStuckInteractions();

    // Set up a timeout to clear login errors after 30 seconds
    let errorTimeout;
    if (loginError) {
      errorTimeout = setTimeout(() => {
        setLoginError(null);
        console.log("Auto-cleared login error after timeout");
      }, 30000);
    }

    return () => {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, [instance, loginError]);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      // Clear any previous login errors
      sessionStorage.removeItem('msal_login_error');
      
      console.log("Checking for existing interactions...");
      
      // Check if there's already an interaction in progress
      if (inProgress !== 'none') {
        console.log("Interaction already in progress:", inProgress);
        setLoginError("Authentication is already in progress. Please wait...");
        return;
      }
      
      // Handle any existing redirect promises to clear the state
      try {
        const response = await instance.handleRedirectPromise();
        if (response) {
          console.log("Cleared existing redirect response");
        }
      } catch (redirectError) {
        console.warn("Error handling existing redirect:", redirectError);
      }
      
      console.log("Initiating login redirect with PKCE flow...");
      await instance.loginRedirect({
        ...loginRequest,
      });
    } catch (error) {
      console.error("Login redirect failed:", error);
      
      // Handle specific MSAL errors
      if (error.errorCode === 'interaction_in_progress') {
        setLoginError("Authentication is already in progress. Please wait for it to complete or refresh the page.");
      } else {
        setLoginError(error.message || "Failed to initiate login. Please try again.");
      }
    }
  };



  return (
    <div className="login-page">
      {/* Animated Background Elements */}
      <div className="background-animation">
        <motion.div 
          className="floating-shape shape-1"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="floating-shape shape-2"
          animate={{ 
            y: [0, 30, 0],
            x: [0, 20, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="floating-shape shape-3"
          animate={{ 
            y: [0, -30, 0],
            x: [0, -15, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Header */}
      <motion.nav 
        className="modern-navbar"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="navbar-container">
          <motion.div 
            className="navbar-brand"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Research AI Assistant</span>
          </motion.div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="login-container">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          {/* Logo Section */}
          <motion.div 
            className="logo-section"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6,
              delay: 0.5,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
          >
            <motion.div 
              className="logo-container"
              whileHover={{ 
                scale: 1.1,
                rotate: 5
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="logo-inner">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            className="content-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <motion.h1 
              className="main-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              Research Document
              <span className="title-highlight"> AI Assistant</span>
            </motion.h1>
            
            <motion.p 
              className="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              Unlock the power of AI-driven document analysis, semantic search, and intelligent research workflows
            </motion.p>

            {/* Error Message */}
            <AnimatePresence>
              {loginError && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="error-content">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{loginError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Button */}
            <motion.button
              className={`login-button ${inProgress !== 'none' ? 'loading' : ''}`}
              onClick={handleLogin}
              disabled={inProgress !== 'none'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              <div className="button-content">
                {inProgress !== 'none' ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <div className="microsoft-icon">
                      <svg viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1h10v10H1V1zm11 0h10v10H12V1zM1 12h10v10H1V12zm11 0h10v10H12V12z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>Continue with Microsoft</span>
                  </>
                )}
              </div>
            </motion.button>

            {/* Security Note */}
            <motion.div 
              className="security-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <div className="security-content">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="security-text">
                  <span className="security-title">Enterprise Security</span>
                  <span className="security-subtitle">Powered by Microsoft Azure Active Directory</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="feature-cards"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          {[
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: "Semantic Search",
              description: "Advanced AI-powered document search"
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: "Document Analysis",
              description: "Intelligent summarization and insights"
            },
            {
              icon: (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-16.5 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: "AI Workflow",
              description: "Automated research processes"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 + index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Login; 