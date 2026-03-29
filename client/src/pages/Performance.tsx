import { useEffect, useState } from 'react';
import api from '../api/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PerformanceMetric {
  endpoint: string;
  method: string;
  serviceName: string;
  avgLatency: number;
  maxLatency: number;
  totalHits: number;
}

export default function Performance() {
  const [data, setData] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/analytics/endpoints');
      setData(response.data || []);
    } catch (err: any) {
      console.error('Failed to load performance metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div className="loading">Analyzing performance...</div>;

  return (
    <div className="performance-page">
      <div className="page-header">
        <h1>Performance & Latency</h1>
        <p className="subtitle">Ranking endpoints by response time and identifying bottlenecks</p>
      </div>

      <div className="chart-section">
        <h3 className="section-title">Average Latency by Endpoint (ms)</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data.sort((a,b) => b.avgLatency - a.avgLatency)}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#94a3b8" 
                tick={{fill: '#94a3b8', fontSize: 12}} 
              />
              <YAxis 
                type="category" 
                dataKey="endpoint" 
                stroke="#94a3b8" 
                tick={{fill: '#94a3b8', fontSize: 10}} 
                width={80}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                itemStyle={{ color: 'var(--primary)' }}
              />
              <Bar dataKey="avgLatency" fill="var(--primary)" barSize={20}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.avgLatency > 500 ? '#ef4444' : entry.avgLatency > 200 ? '#f59e0b' : '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="slow-endpoints-grid">
        <h3 className="section-title">Slowest API Calls Detected</h3>
        <div className="endpoint-cards-container">
          {data
            .filter(d => d.avgLatency > 200)
            .sort((a,b) => b.avgLatency - a.avgLatency)
            .map((ep, idx) => (
              <div key={idx} className="performance-card slow">
                <div className="card-top">
                  <span className={`method-badge ${ep.method.toLowerCase()}`}>{ep.method}</span>
                  <span className="latency-val">{ep.avgLatency} ms</span>
                </div>
                <div className="card-content">
                  <div className="ep-path">{ep.endpoint}</div>
                  <div className="ep-service">{ep.serviceName}</div>
                  <div className="max-latency">Peak: {ep.maxLatency} ms</div>
                </div>
              </div>
            ))}
          {data.length === 0 && <div className="no-data">No performance data captured yet</div>}
        </div>
      </div>

      <style>{`
        .performance-page {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .page-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }

        .subtitle {
          color: var(--text-secondary);
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.25rem;
          letter-spacing: 0.02em;
        }

        .chart-container {
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .endpoint-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }

        .performance-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
          padding: 1.25rem;
          transition: 0.3s;
        }

        .performance-card.slow {
          border-left: 4px solid #ef4444;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .latency-val {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ef4444;
        }

        .ep-path {
          font-family: 'Fira Code', monospace;
          font-size: 0.9rem;
          color: var(--text-primary);
          word-break: break-all;
          margin-bottom: 0.25rem;
        }

        .ep-service {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
        }

        .max-latency {
          font-size: 0.75rem;
          color: #f59e0b;
        }

        .method-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .get { background: #3b82f6; color: white; }
        .post { background: #10b981; color: white; }

        .no-data {
          padding: 2rem;
          text-align: center;
          color: var(--text-secondary);
          grid-column: 1 / -1;
        }

        .loading {
          padding: 4rem;
          text-align: center;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
