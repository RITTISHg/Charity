import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CharityLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Demo credentials
  const DEMO_CREDENTIALS = {
    email: "charity@demo.com",
    password: "charity123"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // For demo purposes, we'll check against hardcoded credentials
      // In production, this should be an API call
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Store auth token (in production this would come from the backend)
        localStorage.setItem('charityAuth', JSON.stringify({
          isAuthenticated: true,
          email: email,
          token: 'demo-token'
        }));
        
        navigate('/charity-dashboard');
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <button 
          onClick={() => navigate('/')} 
          style={styles.homeButton}
        >
          Back to Home
        </button>
        <h1 style={styles.title}>Charity Portal</h1>
        <p style={styles.subtitle}>Please sign in to view donations and pickups</p>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your charity email"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.optionsContainer}>
            <label style={styles.rememberMe}>
              <input type="checkbox" />
              <span style={styles.rememberText}>Remember me</span>
            </label>
            <a href="#" style={styles.forgotPassword}>Forgot Password?</a>
          </div>
          {error && <div style={styles.errorMessage}>{error}</div>}
          <button 
            type="submit" 
            style={{
              ...styles.signInButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Demo credentials hint */}
          <div style={styles.demoCredentials}>
            <p style={styles.demoTitle}>Demo Credentials:</p>
            <p style={styles.demoText}>Email: charity@demo.com</p>
            <p style={styles.demoText}>Password: charity123</p>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  errorMessage: {
    color: '#dc3545',
    backgroundColor: '#fbe9e7',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    textAlign: 'center',
    fontSize: '14px',
  },
  demoCredentials: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px dashed #ddd',
  },
  demoTitle: {
    color: '#666',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
    textAlign: 'center',
  },
  demoText: {
    color: '#666',
    fontSize: '13px',
    margin: '4px 0',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  homeButton: {
    backgroundColor: 'transparent',
    color: '#3c3c3c',
    border: '1px solid #3c3c3c',
    padding: '10px 20px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s',
    width: '100%',
    maxWidth: '200px',
    alignSelf: 'center',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    '&:hover': {
      backgroundColor: '#FAD648',
    }
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#333',
    fontSize: '24px',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#666',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#333',
    fontSize: '14px',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  optionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
  },
  rememberText: {
    userSelect: 'none',
  },
  forgotPassword: {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '14px',
  },
  signInButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};
