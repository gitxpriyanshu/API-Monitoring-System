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
  if (!metrics) return <div className="loading">No data found</div>;

  

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
