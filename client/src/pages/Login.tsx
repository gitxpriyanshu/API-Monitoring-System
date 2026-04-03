import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

type Tab = 'login' | 'signup';

export default function Login() {
  const [tab, setTab] = useState<Tab>(window.location.pathname === '/signup' ? 'signup' : 'login');

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const switchTab = (t: Tab) => {
    setTab(t);
    setError('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const dbResponse: any = await api.post('/auth/login', {
        username: loginUsername,
        password: loginPassword,
      });
      login(dbResponse.data);
      navigate('/overview');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (signupPassword !== signupConfirm) {
      setError('Passwords do not match.');
      return;
    }
    if (signupPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(signupPassword)) {
      setError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(signupPassword)) {
      setError('Password must contain at least one number.');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(signupPassword)) {
      setError('Password must contain at least one special character (e.g. ! @ # $).');
      return;
    }

    setIsLoading(true);
    try {
      const dbResponse: any = await api.post('/auth/signup', {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
      });
      // Auto-login after signup
      login(dbResponse.data);
      navigate('/overview');
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated background orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="auth-card glass-panel">
        {/* Logo */}
        <div className="auth-logo-wrap">
          <div className="auth-logo">
            <span>⚡</span>
          </div>
        </div>
        <h1 className="auth-title">API Monitor</h1>
        <p className="auth-subtitle">Real-time API tracking & analytics</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => switchTab('signup')}
          >
            Create Account
          </button>
          <div className={`auth-tab-indicator ${tab === 'signup' ? 'right' : 'left'}`} />
        </div>

        {/* Messages */}
        {error && (
          <div className="auth-alert auth-alert-error">
            <span>⚠️</span> {error}
          </div>
        )}
        {successMsg && (
          <div className="auth-alert auth-alert-success">
            <span>✅</span> {successMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <label>Username</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input
                  className="input-base auth-input"
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  type="password"
                  className="input-base auth-input"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <><span className="spinner" /> Signing in...</>
              ) : (
                <><span>→</span> Sign In</>
              )}
            </button>

            <p className="auth-switch-text">
              Don't have an account?{' '}
              <button type="button" className="auth-link" onClick={() => switchTab('signup')}>
                Create one free
              </button>
            </p>
          </form>
        )}

        {/* SIGNUP FORM */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="auth-field">
              <label>Username</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input
                  className="input-base auth-input"
                  value={signupUsername}
                  onChange={e => setSignupUsername(e.target.value)}
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Email</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉️</span>
                <input
                  type="email"
                  className="input-base auth-input"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input
                  type="password"
                  className="input-base auth-input"
                  value={signupPassword}
                  onChange={e => setSignupPassword(e.target.value)}
                  placeholder="Min. 8 chars"
                  autoComplete="new-password"
                  required
                />
              </div>
              <p className="password-hint">Must include uppercase, number, and special character (e.g. <strong>Test@123</strong>)</p>
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔑</span>
                <input
                  type="password"
                  className="input-base auth-input"
                  value={signupConfirm}
                  onChange={e => setSignupConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <><span className="spinner" /> Creating account...</>
              ) : (
                <><span>✨</span> Create Account</>
              )}
            </button>

            <p className="auth-switch-text">
              Already have an account?{' '}
              <button type="button" className="auth-link" onClick={() => switchTab('login')}>
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>

      <style>{`
        /* ── Page Layout ── */
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* ── Animated Background Orbs ── */
        .auth-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          animation: orbFloat 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        .auth-orb-1 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, #8b5cf6, #3b82f6);
          top: -120px; left: -80px;
          animation-delay: 0s;
        }
        .auth-orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, #ec4899, #8b5cf6);
          bottom: -100px; right: -60px;
          animation-delay: -3s;
        }
        .auth-orb-3 {
          width: 280px; height: 280px;
          background: radial-gradient(circle, #06b6d4, #3b82f6);
          top: 50%; left: 60%;
          transform: translate(-50%, -50%);
          animation-delay: -5s;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        /* ── Theme Toggle ── */
        .theme-toggle-btn {
          position: fixed;
          top: 20px; right: 20px;
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          font-size: 20px;
          display: flex; align-items: center; justify-content: center;
          z-index: 10;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: var(--card-shadow);
        }
        .theme-toggle-btn:hover {
          transform: rotate(20deg) scale(1.1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }

        /* ── Card ── */
        .auth-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          padding: 40px 40px 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: cardIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ── Logo ── */
        .auth-logo-wrap {
          margin-bottom: 16px;
        }
        .auth-logo {
          width: 68px; height: 68px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
          animation: logoPulse 3s ease-in-out infinite;
        }
        @keyframes logoPulse {
          0%, 100% { box-shadow: 0 8px 24px rgba(139,92,246,0.4); }
          50%       { box-shadow: 0 8px 36px rgba(139,92,246,0.7); }
        }

        /* ── Headings ── */
        .auth-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
          background: linear-gradient(135deg, var(--text-main), var(--accent-color));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .auth-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 28px;
        }

        /* ── Tabs ── */
        .auth-tabs {
          position: relative;
          display: flex;
          width: 100%;
          background: rgba(0,0,0,0.06);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 24px;
          gap: 2px;
        }
        [data-theme='purple'] .auth-tabs {
          background: rgba(255,255,255,0.06);
        }
        .auth-tab {
          flex: 1;
          padding: 10px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-muted);
          transition: color 0.2s;
          position: relative;
          z-index: 1;
        }
        .auth-tab.active {
          color: var(--text-main);
        }
        .auth-tab-indicator {
          position: absolute;
          top: 4px; bottom: 4px;
          width: calc(50% - 4px);
          background: var(--card-bg);
          border-radius: 9px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }
        .auth-tab-indicator.left  { left: 4px; }
        .auth-tab-indicator.right { left: calc(50%); }

        /* ── Alerts ── */
        .auth-alert {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: alertIn 0.3s ease both;
        }
        @keyframes alertIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .auth-alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #ef4444;
        }
        .auth-alert-success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: #10b981;
        }

        /* ── Form ── */
        .auth-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
          animation: formSlide 0.3s ease both;
        }
        @keyframes formSlide {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .auth-field label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.3px;
        }
        .auth-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .auth-input-icon {
          position: absolute;
          left: 14px;
          font-size: 15px;
          pointer-events: none;
          z-index: 1;
        }
        .auth-input {
          padding-left: 42px !important;
        }
        .input-base:focus {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }

        /* ── Submit Button ── */
        .auth-submit-btn {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          border-radius: 10px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border: none;
          margin-top: 4px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.35);
        }
        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.5);
        }
        .auth-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        /* ── Spinner ── */
        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Switch link ── */
        .auth-switch-text {
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
        }
        .auth-link {
          color: var(--accent-color);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: opacity 0.15s;
        }
        .auth-link:hover { opacity: 0.75; }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .auth-card { padding: 28px 22px 24px; }
          .auth-title { font-size: 22px; }
        }

        /* ── Password Hint ── */
        .password-hint {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 4px;
          line-height: 1.4;
        }
        .password-hint strong {
          color: var(--accent-color);
          font-family: 'Courier New', monospace;
        }
      `}</style>
    </div>
  );
}
