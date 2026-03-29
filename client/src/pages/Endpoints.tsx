import { useEffect, useState } from 'react';
import api from '../api/client';
import MetricCard from '../components/MetricCard';
import { Activity, Clock, MapPin } from 'lucide-react';

interface EndpointMetric {
  endpoint: string;
  method: string;
  serviceName: string;
  totalHits: number;
  errorHits: number;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
}

export default function Endpoints() {
  const [endpoints, setEndpoints] = useState<EndpointMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEndpoints = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/analytics/endpoints');
      setEndpoints(response.data || []);
      setError('');
    } catch (err: any) {
      setError('Failed to load endpoint statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  if (isLoading) return <div className="loading">Analyzing endpoints...</div>;

  return (
    <div className="endpoints-page">
      <div className="page-header">
        <div>
          <h1>API Endpoints</h1>
          <p className="subtitle">Performance breakdown for every tracked route</p>
        </div>
        <button className="refresh-btn" onClick={fetchEndpoints}>Refresh</button>
      </div>

      <div className="metrics-summary">
        <MetricCard 
          title="Most Hit Route" 
          value={endpoints[0]?.endpoint || 'None'} 
          subtitle={`${endpoints[0]?.totalHits || 0} total requests`}
          colorHex="#3b82f6"
          icon={<Activity size={24} />}
        />
        <MetricCard 
          title="Slowest Healthy Route" 
          value={endpoints.sort((a,b) => b.avgLatency - a.avgLatency)[0]?.endpoint || 'None'} 
          subtitle={`${endpoints.sort((a,b) => b.avgLatency - a.avgLatency)[0]?.avgLatency || 0} ms average`}
          colorHex="#ef4444"
          icon={<Clock size={24} />}
        />
        <MetricCard 
          title="Total Tracked Paths" 
          value={endpoints.length.toString()} 
          subtitle="Distinct endpoints"
          colorHex="#10b981"
          icon={<MapPin size={24} />}
        />
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="endpoints-table-container">
        <table className="endpoints-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint Path</th>
              <th>Service</th>
              <th>Hits</th>
              <th>Avg Latency</th>
              <th>Error Rate</th>
              <th>Min/Max</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign: 'center', padding: '2rem'}}>No endpoints tracked yet</td></tr>
            ) : (
              endpoints.map((ep, idx) => {
                const errorRate = ((ep.errorHits / ep.totalHits) * 100).toFixed(2);
                const isHighError = parseFloat(errorRate) > 10;
                const isSlow = ep.avgLatency > 500;

                return (
                  <tr key={idx}>
                    <td>
                      <span className={`method-badge ${ep.method.toLowerCase()}`}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="endpoint-path">{ep.endpoint}</td>
                    <td>{ep.serviceName}</td>
                    <td>{ep.totalHits.toLocaleString()}</td>
                    <td className={isSlow ? 'status-error' : ''}>{ep.avgLatency} ms</td>
                    <td className={isHighError ? 'status-error' : 'status-success'}>
                      {errorRate}%
                    </td>
                    <td className="min-max">
                      {ep.minLatency}ms / {ep.maxLatency}ms
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .endpoints-page {
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

        .page-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }

        .subtitle {
          color: var(--text-secondary);
        }

        .refresh-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: 0.3s;
        }

        .refresh-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
        }

        .metrics-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .endpoints-table-container {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .endpoints-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .endpoints-table th {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--card-border);
        }

        .endpoints-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--card-border);
          font-size: 0.95rem;
        }

        .endpoints-table tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .method-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .get { background: #3b82f6; color: white; }
        .post { background: #10b981; color: white; }
        .put { background: #f59e0b; color: white; }
        .delete { background: #ef4444; color: white; }

        .endpoint-path {
          font-family: 'Fira Code', monospace;
          color: var(--primary);
          font-size: 0.85rem;
        }

        .min-max {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .status-success { color: #10b981; }
        .status-error { color: #ef4444; font-weight: 600; }

        .error-banner {
          padding: 1rem;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid #ef4444;
          border-radius: 8px;
        }

        .loading {
          padding: 4rem;
          text-align: center;
          font-size: 1.2rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
