import { useState, useEffect } from 'react';
import api from '../api/client';
import { Plus, Trash2, Shield, Globe, Copy, Check, AlertCircle } from 'lucide-react';

interface ApiKey {
  _id: string;
  name: string;
  description?: string;
  environment: string;
  maskedValue: string;
  isActive: boolean;
  createdAt: string;
}

export default function Keys() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  
  
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEnv, setNewEnv] = useState('production');

  const fetchKeys = async () => {
    try {
      setIsLoading(true);
      const response: any = await api.get('/keys');
      setKeys(response.data);
    } catch (error) {
      console.error('Failed to fetch keys', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      setCreatedKey(null);
      const response: any = await api.post('/keys', {
        name: newName,
        description: newDesc,
        environment: newEnv
      });
      
      setCreatedKey(response.data.keyValue);
      setNewName('');
      setNewDesc('');
      setIsCreating(false);
      fetchKeys();
    } catch (error) {
      console.error('Failed to create key', error);
      setIsCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) return;
    try {
      await api.delete(`/keys/${id}`);
      fetchKeys();
    } catch (error) {
      console.error('Failed to revoke key', error);
    }
  };

  if (isLoading && keys.length === 0) return <div className="loading">Loading API Keys...</div>;

  return (
    <div className="keys-page">
      <div className="page-header">
        <div>
          <h1>API Keys</h1>
          <p>Manage your application access keys and environments</p>
        </div>
      </div>

      {createdKey && (
        <div className="glass-panel success-panel animate-in">
          <div className="success-header">
            <div className="status">
              <Check size={20} className="text-success" />
              <h3>API Key Generated Successfully!</h3>
            </div>
            <button onClick={() => setCreatedKey(null)} className="btn-close">×</button>
          </div>
          <p className="warning-text">
            <AlertCircle size={14} />
            Make sure to copy your API key now. You won't be able to see it again!
          </p>
          <div className="key-display">
            <code className="full-key">{createdKey}</code>
            <button 
              onClick={() => handleCopy(createdKey)} 
              className={`btn-copy ${copying ? 'copied' : ''}`}
            >
              {copying ? <Check size={18} /> : <Copy size={18} />}
              {copying ? 'Copied' : 'Copy Key'}
            </button>
          </div>
        </div>
      )}

      <div className="keys-container">
        {}
        <div className="glass-panel create-key-card">
          <h3>Generate New Key</h3>
          <form onSubmit={handleCreate} className="create-form">
            <div className="form-group">
              <label>Key Name</label>
              <input 
                type="text" 
                placeholder="e.g. Production Mobile App" 
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input 
                type="text" 
                placeholder="What is this key for?" 
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Environment</label>
                <select value={newEnv} onChange={e => setNewEnv(e.target.value)}>
                  <option value="production">Production</option>
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                </select>
              </div>
              <button type="submit" disabled={isCreating} className="btn-primary">
                {isCreating ? 'Generating...' : <><Plus size={18} /> Generate Key</>}
              </button>
            </div>
          </form>
        </div>

        {}
        <div className="keys-list glass-panel">
          <div className="list-header">
            <h3>Active Keys</h3>
            <span className="count">{keys.length} total</span>
          </div>
          
          <div className="table-responsive">
            <table className="keys-table">
              <thead>
                <tr>
                  <th>Target</th>
                  <th>Value</th>
                  <th>Environment</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map(key => (
                  <tr key={key._id}>
                    <td>
                      <div className="key-info">
                        <strong>{key.name}</strong>
                        {key.description && <span>{key.description}</span>}
                      </div>
                    </td>
                    <td>
                      <code className="key-value">
                        {key.maskedValue}
                      </code>
                    </td>
                    <td>
                      <span className={`env-badge ${key.environment}`}>
                        {key.environment === 'production' ? <Shield size={12} /> : <Globe size={12} />}
                        {key.environment}
                      </span>
                    </td>
                    <td>{new Date(key.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleRevoke(key._id)} className="btn-icon delete" title="Revoke Key">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {keys.length === 0 && (
                  <tr>
                    <td colSpan={5} className="empty-state">No API keys generated yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .keys-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .page-header h1 {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .keys-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .keys-container {
            grid-template-columns: 1fr;
          }
        }

        .create-key-card {
          padding: 24px;
          height: fit-content;
        }

        .create-key-card h3 {
          margin-bottom: 24px;
          font-size: 18px;
        }

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .form-group input, .form-group select {
          padding: 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          color: white;
          font-size: 14px;
        }

        .form-row {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 10px;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: var(--primary-color);
          color: white;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .keys-list {
          padding: 0;
          overflow: hidden;
        }

        .list-header {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--card-border);
        }

        .list-header h3 {
          font-size: 18px;
        }

        .count {
          font-size: 13px;
          color: var(--text-muted);
        }

        .table-responsive {
          overflow-x: auto;
        }

        .keys-table {
          width: 100%;
          border-collapse: collapse;
        }

        .keys-table th {
          text-align: left;
          padding: 16px 24px;
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
          border-bottom: 1px solid var(--card-border);
        }

        .keys-table td {
          padding: 20px 24px;
          border-bottom: 1px solid var(--card-border);
          vertical-align: middle;
        }

        .key-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .key-info strong {
          font-size: 14px;
        }

        .key-info span {
          font-size: 12px;
          color: var(--text-muted);
        }

        .key-value {
          font-family: 'JetBrains Mono', monospace;
          background: rgba(0,0,0,0.2);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 13px;
          color: #a5b4fc;
        }

        .env-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 99px;
          font-size: 12px;
          text-transform: capitalize;
        }

        .env-badge.production {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .env-badge.development {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .btn-icon {
          background: none;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }

        .btn-icon.delete:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .empty-state {
          text-align: center;
          padding: 60px !important;
          color: var(--text-muted);
        }

        .loading {
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
        }

        .success-panel {
          border-left: 4px solid #10b981;
          padding: 24px;
          margin-bottom: 24px;
        }

        .success-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .success-header .status {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .success-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #10b981;
        }

        .btn-close {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 24px;
          cursor: pointer;
          line-height: 1;
        }

        .warning-text {
          font-size: 13px;
          color: #f59e0b;
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 20px;
        }

        .key-display {
          display: flex;
          gap: 12px;
          align-items: stretch;
          background: rgba(0,0,0,0.2);
          padding: 4px;
          border-radius: 12px;
        }

        .full-key {
          flex: 1;
          padding: 12px 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: #a5b4fc;
          overflow-x: auto;
          white-space: nowrap;
        }

        .btn-copy {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 20px;
          background: rgba(255,255,255,0.05);
          color: white;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-copy:hover {
          background: rgba(255,255,255,0.1);
        }

        .btn-copy.copied {
          background: #10b981;
          color: white;
        }

        .animate-in {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
