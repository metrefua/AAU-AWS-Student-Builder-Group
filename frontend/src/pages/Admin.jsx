import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import UserManagement from '../components/admin/UserManagement';
import EventManagement from '../components/admin/EventManagement';
import DashboardStats from '../components/admin/DashboardStats';
import './styles/Admin.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const Admin = ({ theme, toggleTheme }) => {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);


  const scrollToSection = (sectionId) => {
    // Navigate to home page with section anchor
    navigate(`/#${sectionId}`);
  };


  useEffect(() => {
    // Wait for authentication to complete before checking user role
    if (authLoading) {
      return;
    }

    // Check if user is admin
    if (user && user.role !== 'admin') {
      showToast('Access denied. Admin privileges required.', 'error');
      // Redirect to home page
      navigate('/');
      return;
    }

    if (user && user.role === 'admin') {
      setLoading(false);
      fetchDashboardStats();
    } else if (!user) {
      // User is not authenticated, redirect to auth page
      navigate('/auth');
    }
  }, [user, authLoading, showToast, navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        showToast('Failed to fetch dashboard stats', 'error');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      showToast('Failed to fetch dashboard stats', 'error');
    }
  };

  // Show loading while authentication is in progress
  if (authLoading || loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  // Don't render anything if user is not admin or not authenticated
  if (!user || user.role !== 'admin') {
    return null;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'events', label: 'Event Management', icon: '📅' }
  ];

  return (
    <div className="admin-container">
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme}
        activeSection="admin"
        scrollToSection={scrollToSection}
      />
      
      <div className="admin-content">
        <div className="admin-header">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
          
          <div className="admin-title">
            <h1>Admin Dashboard</h1>
            <p>Manage users, events, and platform settings</p>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-content">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`admin-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="admin-main">
          <div className="admin-content-area">
            {activeTab === 'dashboard' && (
              <DashboardStats 
                stats={stats} 
                onRefresh={fetchDashboardStats} 
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'users' && (
              <UserManagement />
            )}
            {activeTab === 'events' && (
              <EventManagement />
            )}
          </div>
        </main>
      </div>

      <Footer theme={theme} />
    </div>
  );
};

export default Admin; 