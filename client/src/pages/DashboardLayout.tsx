import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        
        {/* Child routes load inside this animated container */}
        <div className="content-container slide-up">
          <Outlet />
        </div>
      </main>

      <style>{`
        .content-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .slide-up {
          animation: slideUp 0.4s ease-out forwards;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
