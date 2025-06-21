import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import './styles/AdminComponents.css';

const DashboardStats = ({ stats, onRefresh, setActiveTab }) => {
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
      showToast('Dashboard stats refreshed successfully', 'success');
    } catch {
      showToast('Failed to refresh stats', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  if (!stats) {
    return (
      <div className="dashboard-stats">
        <div className="stats-header">
          <h2>Dashboard Overview</h2>
          <button 
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? '🔄' : '🔄'} Refresh
          </button>
        </div>
        <div className="stats-loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard stats...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'blue',
      description: 'Registered users'
    },
    {
      title: 'Admin Users',
      value: stats.totalAdmins,
      icon: '👑',
      color: 'purple',
      description: 'Administrators'
    },
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: '📅',
      color: 'green',
      description: 'All events created'
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      icon: '✅',
      color: 'orange',
      description: 'Currently active'
    },
    {
      title: 'Recent Registrations',
      value: stats.recentRegistrations,
      icon: '🆕',
      color: 'teal',
      description: 'Last 7 days'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: '🚀',
      color: 'red',
      description: 'Future events'
    }
  ];

  return (
    <div className="dashboard-stats">
      <div className="stats-header">
        <h2>Dashboard Overview</h2>
        <button 
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? '🔄' : '🔄'} Refresh
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value.toLocaleString()}</p>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="stats-summary">
        <div className="summary-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button 
              className="action-btn primary" 
              onClick={() => setActiveTab('events')}
            >
              📝 Create New Event
            </button>
            <button 
              className="action-btn secondary" 
              onClick={() => setActiveTab('users')}
            >
              👥 View All Users
            </button>
            <button 
              className="action-btn secondary" 
              onClick={() => setActiveTab('dashboard')}
            >
              📊 View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats; 