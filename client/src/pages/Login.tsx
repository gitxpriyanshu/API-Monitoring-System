import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@12345!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const dbResponse: any = await api.post('/auth/login', { username, password });
      login(dbResponse.data);
      navigate('/overview');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>

      <div className="login-card glass-panel">
        <div className="logo-container">
          <div className="logo">⚡</div>
        </div>
        
        <h2>API Monitor</h2>
        <p className="subtitle">Sign in to access your dashboard</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input 
              className="input-base" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="admin"
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-base" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="btn-primary login-btn" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="hint-text">Default credentials: admin / Admin@12345!</p>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
        }
        .theme-toggle {
          position: absolute;
          top: 24px;
          right: 24px;
          padding: 8px 16px;
          border-radius: 20px;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          color: var(--text-main);
          font-weight: 500;
          backdrop-filter: blur(10px);
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .logo-container {
          width: 64px;
          height: 64px;
          background: var(--accent-color);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .logo {
          font-size: 32px;
          color: white;
        }
        h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .subtitle {
          color: var(--text-muted);
          font-size: 14px;
          margin-bottom: 32px;
        }
        .error-message {
          width: 100%;
          background: rgba(239, 68, 68, 0.1);
          color: var(--status-error);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          border: 1px solid rgba(239, 68, 68, 0.2);
          text-align: center;
        }
        form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-group label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-muted);
        }
        .login-btn {
          width: 100%;
          margin-top: 8px;
        }
        .hint-text {
          margin-top: 24px;
          font-size: 13px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
