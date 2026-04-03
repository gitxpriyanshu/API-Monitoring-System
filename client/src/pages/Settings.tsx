import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { User, Shield, Mail, Calendar, LogOut } from 'lucide-react';

export default function Settings() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) return <div className="loading">Loading your profile...</div>;

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and view your profile information</p>
      </div>

      <div className="settings-grid">
        <div className="profile-section glass-panel">
          <div className="section-header">
            <User size={20} />
            <h2>Profile Information</h2>
          </div>
          
          <div className="profile-card">
            <div className="avatar-large">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <div className="detail-item">
                <span className="label">Username</span>
                <span className="value">{profile?.username}</span>
              </div>
              <div className="detail-item">
                <span className="label">Email Address</span>
                <div className="value-with-icon">
                  <Mail size={14} />
                  <span>{profile?.email}</span>
                </div>
              </div>
              <div className="detail-item">
                <span className="label">Account Role</span>
                <div className="value-with-icon">
                  <Shield size={14} />
                  <span className="role-badge">{profile?.role.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="detail-item">
                <span className="label">Member Since</span>
                <div className="value-with-icon">
                  <Calendar size={14} />
                  <span>{new Date(profile?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="actions-section glass-panel">
          <div className="section-header">
            <h2>Account Actions</h2>
          </div>
          <div className="actions-list">
            <button className="action-btn logout" onClick={logout}>
              <LogOut size={18} />
              <span>Sign Out of All Devices</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .settings-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .settings-grid { grid-template-columns: 1fr; }
        }
        .glass-panel {
          padding: 24px;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--card-border);
          padding-bottom: 16px;
        }
        .section-header h2 { font-size: 1.1rem; font-weight: 600; }
        
        .profile-card {
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }
        .avatar-large {
          width: 80px;
          height: 80px;
          background: var(--accent-color);
          color: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          flex-shrink: 0;
        }
        .profile-details {
          flex: 1;
          display: grid;
          gap: 20px;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-item .label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .detail-item .value {
          font-size: 1rem;
          font-weight: 500;
        }
        .value-with-icon {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-main);
          font-size: 1rem;
        }
        .role-badge {
          background: rgba(139, 92, 246, 0.1);
          color: var(--accent-color);
          padding: 2px 10px;
          border-radius: 99px;
          font-size: 0.8rem;
          text-transform: capitalize;
          font-weight: 600;
        }
        
        .actions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .action-btn {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid var(--card-border);
          background: rgba(255,255,255,0.02);
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }
        .action-btn:hover {
          background: rgba(255,255,255,0.05);
        }
        .action-btn.logout {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.2);
        }
        .action-btn.logout:hover {
          background: rgba(239, 68, 68, 0.05);
        }
        
        .loading {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
