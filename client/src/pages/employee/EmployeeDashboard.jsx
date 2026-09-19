import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalLeave: 20,
    availableLeave: 20,
    usedLeave: 0,
    pendingRequests: 0,
    recentRequests: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaves/my-stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Employee';
  const total = stats.totalLeave || 20;
  const used = stats.usedLeave || 0;
  const available = stats.availableLeave !== undefined ? stats.availableLeave : total - used;
  const percentageUsed = Math.min(100, Math.round((used / total) * 100));

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'badge-status-approved';
      case 'Rejected':
        return 'badge-status-rejected';
      case 'Pending':
      default:
        return 'badge-status-pending';
    }
  };

  return (
    <div className="dashboard-content-area">
      {/* Page Header */}
      <div className="page-header-group">
        <h1 className="page-main-title">Welcome, {firstName}!</h1>
        <p className="page-sub-title">Track your leave balance and manage your requests.</p>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="stat-cards-grid">
        {/* Total Leave */}
        <div className="stat-card stat-total">
          <div className="stat-icon-wrapper icon-total">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Total Leave</span>
            <span className="stat-value">{total}</span>
          </div>
        </div>

        {/* Available Leave */}
        <div className="stat-card stat-available">
          <div className="stat-icon-wrapper icon-available">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Available Leave</span>
            <span className="stat-value">{available}</span>
          </div>
        </div>

        {/* Used Leave */}
        <div className="stat-card stat-used">
          <div className="stat-icon-wrapper icon-used">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Used Leave</span>
            <span className="stat-value">{used}</span>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="stat-card stat-pending">
          <div className="stat-icon-wrapper icon-pending">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-text-group">
            <span className="stat-label">Pending Requests</span>
            <span className="stat-value">{stats.pendingRequests}</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Leave Balance Progress & Quick Actions */}
      <div className="dashboard-split-grid">
        {/* Leave Balance Card */}
        <div className="content-card balance-card">
          <div className="card-top-row">
            <h3 className="card-heading">Leave Balance</h3>
            <span className="percentage-tag">{percentageUsed}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${percentageUsed}%` }}
            ></div>
          </div>
          <div className="balance-info-row">
            <span>Used {used} of {total} days</span>
            <span className="days-remaining">{available} days remaining</span>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="content-card quick-actions-card">
          <h3 className="card-heading">Quick Actions</h3>
          <div className="quick-actions-btns">
            <Link to="/employee/apply" className="btn-primary-action">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Apply for Leave
            </Link>
            <Link to="/employee/requests" className="btn-secondary-action">
              View My Requests
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Leave Requests */}
      <div className="content-card recent-requests-card">
        <h3 className="card-heading">Recent Leave Requests</h3>

        {stats.recentRequests && stats.recentRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Leave Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentRequests.map((req, index) => (
                  <tr key={req._id || index}>
                    <td>{index + 1}</td>
                    <td className="font-semibold">{req.leaveType}</td>
                    <td>{req.startDate}</td>
                    <td>{req.endDate}</td>
                    <td>{req.duration} {req.duration === 1 ? 'day' : 'days'}</td>
                    <td>
                      <span className={`status-pill ${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="table-action-link"
                        onClick={() => navigate('/employee/requests')}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state-container">
            <div className="empty-state-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <p className="empty-title">No leave requests yet</p>
            <p className="empty-subtitle">Apply for leave to see your requests here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
