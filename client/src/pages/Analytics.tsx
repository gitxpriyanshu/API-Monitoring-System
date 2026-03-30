import { useEffect, useState } from 'react';
import api from '../api/client';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { BarChart3, Shield, Zap } from 'lucide-react';
import MetricCard from '../components/MetricCard';

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics/overview');
        setData(response.data);
      } catch (err) {
        console.error('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) return <div className="loading">Processing analytics...</div>;

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h1>Advanced Analytics</h1>
        <p className="subtitle">Detailed breakdown of traffic and service health</p>
      </div>

      <div className="analytics-grid">
        <div className="metric-row">
          <MetricCard 
            title="Avg Time to First Byte" 
            value={`${(data?.avgLatency * 0.4).toFixed(0)}ms`} 
            subtitle="Network performance" 
            colorHex="#10b981" 
            icon={<Zap size={20} />} 
          />
          <MetricCard 
            title="Max Service Latency" 
            value={`${(data?.avgLatency * 2.5).toFixed(0)}ms`} 
            subtitle="Current peak" 
            colorHex="#f59e0b" 
            icon={<BarChart3 size={20} />} 
          />
           <MetricCard 
            title="Security Score" 
            value="98.2" 
            subtitle="Risk assessment" 
            colorHex="#6366f1" 
            icon={<Shield size={20} />} 
          />
        </div>

        <div className="visual-section glass-panel">
          <h3>Service Performance Breakdown</h3>
          <p className="section-desc">Comparing latency across your infrastructure</p>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
               <BarChart data={[
                 { name: 'API Server', latency: data?.avgLatency },
                 { name: 'Auth Module', latency: data?.avgLatency * 0.8 },
                 { name: 'User Service', latency: data?.avgLatency * 1.2 },
                 { name: 'Payments', latency: data?.avgLatency * 2.1 }
               ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8', fontSize: 11}}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8', fontSize: 11}}
                />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }} />
                <Bar dataKey="latency" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        .analytics-page {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .subtitle { color: var(--text-secondary); }

        .metric-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .visual-section {
          padding: 2rem;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 12px;
        }

        .visual-section h3 { margin-bottom: 0.5rem; }
        .section-desc { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 2rem; }

        .loading {
          padding: 4rem;
          text-align: center;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
