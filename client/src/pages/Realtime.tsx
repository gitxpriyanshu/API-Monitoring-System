import { useEffect, useState } from 'react';
import api from '../api/client';

interface ApiHitTrace {
  _id: string;
  timestamp: string;
  serviceName: string;
  endpoint: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  ip: string;
}

export default function Realtime() {
  const [hits, setHits] = useState<ApiHitTrace[]>([]);
  const [isLive, setIsLive] = useState(true);

  const fetchHits = async () => {
    try {
      const response = await api.get('/analytics/trace?limit=25');
      setHits(response.data || []);
    } catch (err) {
      console.error('Failed to poll real-time hits');
    }
  };

  useEffect(() => {
    fetchHits();
    let interval: any;
    if (isLive) {
      interval = setInterval(fetchHits, 3000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="realtime-page">
      <div className="page-header">
        <div>
          <h1>Real-time Traffic</h1>
          <p className="subtitle">Live stream of incoming API requests across all services</p>
        </div>
        <div className="status-badge" onClick={() => setIsLive(!isLive)}>
          <span className={`dot ${isLive ? 'pulsing' : ''}`}></span>
          {isLive ? 'LIVE' : 'PAUSED'}
        </div>
      </div>

      <div className="hits-container glass-panel">
        <div className="hits-header">
          <span>Method</span>
          <span>Endpoint</span>
          <span>Service</span>
          <span>Status</span>
          <span>Latency</span>
          <span>Time</span>
        </div>
        <div className="hits-list">
          {hits.map((hit) => (
            <div key={hit._id} className="hit-row">
              <span className={`method-badge ${hit.method.toLowerCase()}`}>{hit.method}</span>
              <span className="hit-path">{hit.endpoint}</span>
              <span className="hit-service">{hit.serviceName}</span>
              <span className={`hit-status ${hit.statusCode >= 400 ? 'status-error' : 'status-success'}`}>
                {hit.statusCode}
              </span>
              <span className="hit-latency">{hit.latencyMs}ms</span>
              <span className="hit-time">{new Date(hit.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
          {hits.length === 0 && <div className="no-data">Listening for incoming traffic...</div>}
        </div>
      </div>

      <style>{`
        .realtime-page {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }

        .status-badge:hover { background: rgba(255, 255, 255, 0.08); }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
        }

        .dot.pulsing {
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulse 1.5s infinite linear;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .hits-container {
          border-radius: 12px;
          overflow: hidden;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
        }

        .hits-header {
          display: grid;
          grid-template-columns: 80px 1fr 140px 80px 100px 100px;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--card-border);
        }

        .hits-list {
          max-height: 600px;
          overflow-y: auto;
        }

        .hit-row {
          display: grid;
          grid-template-columns: 80px 1fr 140px 80px 100px 100px;
          padding: 0.75rem 1.5rem;
          align-items: center;
          border-bottom: 1px solid var(--card-border);
          font-size: 0.9rem;
          transition: 0.2s;
        }

        .hit-row:hover { background: rgba(255, 255, 255, 0.02); }

        .hit-path { font-family: 'Fira Code', monospace; color: var(--primary); font-size: 0.85rem; }
        .hit-service { color: var(--text-secondary); font-size: 0.85rem; }
        .hit-latency { color: var(--text-secondary); }
        .hit-time { color: var(--text-muted); font-size: 0.8rem; }

        .method-badge {
          width: fit-content;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .get { background: rgba(59, 130, 246, 0.2); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); }
        .post { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }

        .status-success { color: #10b981; font-weight: 600; }
        .status-error { color: #ef4444; font-weight: 600; }

        .no-data { padding: 4rem; text-align: center; color: var(--text-secondary); }
      `}</style>
    </div>
  );
}
