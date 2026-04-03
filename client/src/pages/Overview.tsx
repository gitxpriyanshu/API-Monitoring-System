import { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import api from '../api/client';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Activity, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Zap 
} from 'lucide-react';

interface OverviewMetrics {
  totalHits: number;
  avgLatency: number;
  errorRate: number;
  successRate: number;
  uniqueServices: number;
  uniqueEndpoints: number;
}

export default function Overview() {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, trafficRes, statusRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/traffic'),
          api.get('/analytics/status-codes')
        ]);
        
        setMetrics(overviewRes.data);
        setTrafficData(trafficRes.data);
        setStatusData(statusRes.data);
      } catch (error) {
        console.error('Failed to load overview data', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (isLoading) return <div className="loading">Loading dashboard data...</div>;
  
  if (!metrics || metrics.totalHits === 0) {
    return (
      <div className="overview-page empty">
        <div className="empty-state-card glass-panel animate-in">
          <div className="empty-icon">🚀</div>
          <h1>Welcome to API Monitor!</h1>
          <p>You're all set up. Now let's start tracking your first API.</p>
          
          <div className="steps-list">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-content">
                <h3>Generate an API Key</h3>
                <p>Go to the <strong>Keys</strong> page and create your first access token.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-content">
                <h3>Integrate with your App</h3>
                <p>Send a POST request to <code>{window.location.origin}/api/hit</code> with your API key in the headers.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-content">
                <h3>Watch Real-time Data</h3>
                <p>Once your first request hits our servers, data will appear here instantly!</p>
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={() => window.location.href='/keys'}>
            Go to API Keys →
          </button>
        </div>

        <style>{`
          .overview-page.empty {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 70vh;
          }
          .empty-state-card {
            max-width: 600px;
            padding: 3rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }
          .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
          .empty-state-card h1 { font-size: 2rem; }
          .empty-state-card p { color: var(--text-secondary); }
          
          .steps-list {
            width: 100%;
            text-align: left;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin: 2rem 0;
          }
          .step {
            display: flex;
            gap: 1.5rem;
            align-items: flex-start;
          }
          .step-num {
            width: 32px;
            height: 32px;
            background: var(--accent-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            flex-shrink: 0;
          }
          .step-content h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
          .step-content p { font-size: 0.9rem; }
          
          .animate-in {
            animation: slideUp 0.5s ease-out;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="overview-page">
      <div className="page-header">
        <h1>Overview</h1>
        <p>Welcome to your API monitoring dashboard</p>
      </div>

      <div className="metrics-grid">
        <MetricCard 
          title="Total Hits" 
          value={metrics.totalHits.toLocaleString()} 
          subtitle="Last 24 hours" 
          colorHex="#3b82f6" 
          icon={<Activity size={20} />} 
        />
        <MetricCard 
          title="Average Latency" 
          value={`${metrics.avgLatency} ms`} 
          subtitle="Response time" 
          colorHex="#8b5cf6" 
          icon={<Clock size={20} />} 
        />
        <MetricCard 
          title="Error Rate" 
          value={`${metrics.errorRate}%`} 
          subtitle={`${Math.floor((metrics.errorRate / 100) * metrics.totalHits)} errors`} 
          colorHex="#ef4444" 
          icon={<AlertCircle size={20} />} 
        />
        <MetricCard 
          title="Success Rate" 
          value={`${metrics.successRate}%`} 
          subtitle={`${Math.floor((metrics.successRate / 100) * metrics.totalHits)} success`} 
          colorHex="#10b981" 
          icon={<CheckCircle2 size={20} />} 
        />
        <MetricCard 
          title="Unique Services" 
          value={metrics.uniqueServices} 
          subtitle="Active services" 
          colorHex="#6366f1" 
          icon={<Layers size={20} />} 
        />
        <MetricCard 
          title="Unique Endpoints" 
          value={metrics.uniqueEndpoints} 
          subtitle="API endpoints" 
          colorHex="#f59e0b" 
          icon={<Zap size={20} />} 
        />
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-panel">
          <div className="chart-header">
            <h3>API Traffic Trends</h3>
            <span>Request volume over time</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="timeBucket" 
                  tickFormatter={(val) => new Date(val).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8', fontSize: 11}}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{fill: '#94a3b8', fontSize: 11}}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                  labelFormatter={(val) => new Date(val).toLocaleString()}
                />
                <Line type="monotone" dataKey="totalHits" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card glass-panel">
          <div className="chart-header">
            <h3>Status Code Distribution</h3>
            <span>HTTP status code breakdown</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="label"
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        .overview-page {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .page-header p {
          color: var(--text-muted);
          font-size: 15px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .chart-card {
          padding: 24px;
        }

        .chart-header {
          margin-bottom: 24px;
        }

        .chart-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .chart-header span {
          font-size: 13px;
          color: var(--text-muted);
        }

        .loading {
          padding: 40px;
          text-align: center;
          font-size: 16px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
