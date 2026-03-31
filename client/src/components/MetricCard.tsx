interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  colorHex: string;
  icon: React.ReactNode;
}

export default function MetricCard({ title, value, subtitle, colorHex, icon }: MetricCardProps) {
  return (
    <div className="metric-card glass-panel" style={{ '--card-accent': colorHex } as React.CSSProperties}>
      <div className="card-header">
        <span className="card-title">{title}</span>
        <div className="card-icon" style={{ backgroundColor: `${colorHex}15`, color: colorHex }}>
          {icon}
        </div>
      </div>
      
      <div className="card-body">
        <h2 className="card-value" style={{ color: colorHex }}>{value}</h2>
        <span className="card-subtitle">{subtitle}</span>
      </div>

      <div className="card-progress-bar">
        <div 
          className="progress-fill" 
          style={{ background: `linear-gradient(90deg, ${colorHex}40 0%, ${colorHex} 100%)` }}
        ></div>
      </div>

      <style>{`
        .metric-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted);
        }

        .card-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          backdrop-filter: blur(4px);
        }

        .card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-value {
          font-size: 32px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        .card-subtitle {
          font-size: 12px;
          color: var(--text-muted);
        }

        .card-progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: rgba(0, 0, 0, 0.05);
        }
        
        [data-theme='purple'] .card-progress-bar {
          background: rgba(255, 255, 255, 0.05);
        }

        .progress-fill {
          height: 100%;
          width: 75%; 
          border-radius: 0 4px 4px 0;
        }
      `}</style>
    </div>
  );
}
