import React from "react";
import { useNavigate } from "react-router-dom";

export function LogIn() {
  const navigate = useNavigate();

  const handleAdminAccess = (e) => {
    e.preventDefault();
    navigate('/admin-dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    // For now, we'll just navigate to the admin dashboard
    navigate('/admin-dashboard');
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Please sign in to continue</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
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

          <button type="submit" style={styles.signInButton}>
            Sign In
          </button>

          <button
            type="button"
            onClick={handleAdminAccess}
            style={styles.adminButton}
          >
            Access Admin Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate('/charity-login')}
            style={{...styles.adminButton, backgroundColor: '#3498db'}}
          >
            Charity Login
          </button>

          <div style={styles.socialLoginContainer}>
            <p style={styles.socialText}>Or continue with</p>
            <div style={styles.socialIconsContainer}>
              <button type="button" style={styles.socialButton}>
                <svg style={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                </svg>
              </button>
              <button type="button" style={styles.socialButton}>
                <svg style={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                </svg>
              </button>
            </div>
          </div>

          <p style={styles.signUpText}>
            Don't have an account? <a href="#" style={styles.signUpLink}>Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #ffffff 0%, #f3f0eb 70%, #d2b48c 100%)',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '1rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    margin: '0 1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#718096',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.875rem',
    color: '#4a5568',
    fontWeight: '600',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
  },
  optionsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#4a5568',
  },
  rememberText: {
    userSelect: 'none',
  },
  forgotPassword: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#667eea',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginBottom: '0.75rem',
  },
  adminButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    width: '100%',
    marginBottom: '1.5rem',
  },
  socialLoginContainer: {
    marginTop: '1.5rem',
    textAlign: 'center',
  },
  socialText: {
    color: '#718096',
    marginBottom: '1rem',
    position: 'relative',
  },
  socialIconsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  socialButton: {
    backgroundColor: 'transparent',
    border: '1px solid #e2e8f0',
    borderRadius: '0.375rem',
    padding: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  icon: {
    width: '1.5rem',
    height: '1.5rem',
    fill: '#718096',
  },
  signUpText: {
    textAlign: 'center',
    color: '#718096',
    marginTop: '1.5rem',
  },
  signUpLink: {
    color: '#667eea',
    fontWeight: '600',
    textDecoration: 'none',
  },

};