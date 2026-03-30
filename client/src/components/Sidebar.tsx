import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Key,
  Activity, 
  Gauge, 
  Link2, 
  XCircle, 
  Settings,
  Zap
} from 'lucide-react';

export default function Sidebar() {
  const routes = [
    { path: '/overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { path: '/keys', label: 'API Keys', icon: <Key size={18} /> }, // New
    { path: '/realtime', label: 'Real-time', icon: <Activity size={18} /> },
    { path: '/performance', label: 'Performance', icon: <Gauge size={18} /> },
    { path: '/endpoints', label: 'Endpoints', icon: <Link2 size={18} /> },
    { path: '/errors', label: 'Errors', icon: <XCircle size={18} /> },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Zap size={22} fill="white" />
        </div>
        <div className="brand">
          <h3>API Monitor</h3>
          <span>By Code Architecture</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {routes.map(r => (
          <NavLink 
            key={r.path} 
            to={r.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="icon">{r.icon}</span>
            <span className="label">{r.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="icon"><Settings size={18} /></span>
          <span className="label">Settings</span>
        </NavLink>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--sidebar-border);
          border-radius: 0;
          background: var(--sidebar-bg);
          z-index: 100;
        }
        .sidebar-header {
          padding: 32px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--accent-color);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
        }
        .brand h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .brand span {
          font-size: 11px;
          color: var(--text-muted);
        }
        .sidebar-nav {
          flex: 1;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: var(--sidebar-text);
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;
        }
        .nav-item:hover {
          background: rgba(139, 92, 246, 0.1);
          color: var(--accent-color);
        }
        .nav-item.active {
          background: var(--sidebar-active);
          color: var(--sidebar-active-text);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--sidebar-border);
        }
      `}</style>
    </aside>
  );
}
// Vercel Force Build: Mon Mar 30 20:42:43 IST 2026
