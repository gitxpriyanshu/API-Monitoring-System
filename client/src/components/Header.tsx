import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { RefreshCw, User, LogOut, Moon, Sun, Clock } from 'lucide-react';

export default function Header() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header glass-panel">
      <div className="header-left">
        <span className="last-updated">
          <Clock size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <User size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          {user?.username} ({user?.clientId ? 'Client' : 'Super Admin'})
        </div>
        
        <button className="icon-btn" onClick={() => window.location.reload()} title="Refresh">
          <RefreshCw size={14} /> Refresh
        </button>
        
        <button className="icon-btn theme-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>
        
        <button className="icon-btn logout-btn" onClick={logout} title="Logout">
          <LogOut size={14} /> Logout
        </button>
      </div>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          margin: 24px 0 32px 0;
          border-radius: 12px;
        }
        .last-updated {
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 500;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .user-info {
          font-size: 13px;
          color: var(--text-main);
          font-weight: 500;
          background: rgba(0, 0, 0, 0.05);
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid var(--card-border);
        }
        [data-theme='purple'] .user-info {
          background: rgba(0, 0, 0, 0.2);
        }
        .icon-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background: rgba(0,0,0,0.05);
          border-color: var(--text-muted);
        }
        [data-theme='purple'] .icon-btn:hover {
          background: rgba(139, 92, 246, 0.2);
          border-color: var(--accent-color);
        }
        .logout-btn {
          color: var(--status-error);
          border-color: rgba(239, 68, 68, 0.2);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: var(--status-error);
          border-color: var(--status-error);
        }
      `}</style>
    </header>
  );
}
