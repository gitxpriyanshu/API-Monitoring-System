import { useEffect, useState } from 'react';
import api from '../api/client';

interface ErrorMetric {
  endpoint: string;
  method: string;
  serviceName: string;
  errorHits: number;
  totalHits: number;
  lastErrorAt: string;
}

export default function Errors() {
  const [data, setData] = useState<ErrorMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/analytics/endpoints');
      
      setData(response.data?.filter((ep: any) => ep.errorHits > 0) || []);
    } catch (err: any) {
      console.error('Failed to load error statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div className="loading">Analyzing error patterns...</div>;

  return (
    <div className="errors-page">
      <div className="page-header">
        <div>
          <h1>Error Tracking</h1>
          <p className="subtitle">Real-time breakdown of API failures and 4xx/5xx status codes</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>Refresh</button>
      </div>

      <div className="error-grid">
        {data.length === 0 ? (
          <div className="no-errors-card">
            <span className="smile">🎉</span>
            <h2>Zero Errors Detected</h2>
            <p>Your systems are looking perfectly healthy across all services.</p>
          </div>
        ) : (
          data.map((ep, idx) => {
            const errorRate = ((ep.errorHits / ep.totalHits) * 100).toFixed(2);
            return (
              <div key={idx} className="error-card">
                <div className="error-card-top">
                  <span className={`method-badge ${ep.method.toLowerCase()}`}>{ep.method}</span>
                  <div className="error-stat">
                    <span className="error-count">{ep.errorHits} failures</span>
                    <span className="error-pct">{errorRate}% Rate</span>
                  </div>
                </div>
                <div className="error-card-content">
                  <div className="ep-path">{ep.endpoint}</div>
                  <div className="ep-service">{ep.serviceName}</div>
                  <div className="progress-bar-container">
                    <div className="progress-fill" style={{ width: `${errorRate}%` }}></div>
                  </div>
                  <div className="last-seen">Last failure detected: {new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .errors-page {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }

        .subtitle {
          color: var(--text-secondary);
        }

        .refresh-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .refresh-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .error-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .no-errors-card {
          grid-column: 1 / -1;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          padding: 4rem;
          text-align: center;
          border-radius: 20px;
        }

        .smile { font-size: 4rem; margin-bottom: 1.5rem; display: block; }
        .no-errors-card h2 { font-size: 2rem; margin-bottom: 0.5rem; color: #10b981; }

        .error-card {
          background: rgba(239, 68, 68, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .error-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-stat {
          text-align: right;
          display: flex;
          flex-direction: column;
        }

        .error-count { font-size: 1.2rem; font-weight: 700; color: #ef4444; }
        .error-pct { font-size: 0.8rem; color: #ef4444; opacity: 0.8; }

        .ep-path {
          font-family: 'Fira Code', monospace;
          font-size: 0.95rem;
          color: var(--text-primary);
          word-break: break-all;
          margin-bottom: 0.2rem;
        }

        .ep-service { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; }

        .progress-bar-container {
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-fill { height: 100%; background: #ef4444; border-radius: 3px; }

        .last-seen { font-size: 0.75rem; color: var(--text-secondary); font-style: italic; }

        .method-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .get { background: #3b82f6; color: white; }
        .post { background: #10b981; color: white; }

        .loading {
          padding: 4rem;
          text-align: center;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
